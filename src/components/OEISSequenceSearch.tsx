
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import SequenceCard from "./SequenceCard";

export default function OEISSequenceSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"search" | "import" | "bulk">("search");
  const [startId, setStartId] = useState(1);
  const [count, setCount] = useState(10);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalSequences, setTotalSequences] = useState(0);

  // Fetch total OEIS sequences on component mount
  useEffect(() => {
    const fetchTotalSequences = async () => {
      try {
        const { count, error } = await supabase
          .from('oeis_sequences')
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        setTotalSequences(count || 0);
      } catch (error) {
        console.error("Error fetching total sequences:", error);
      }
    };

    fetchTotalSequences();
  }, [importing]);

  const searchSequences = async () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    setLoading(true);
    try {
      // First, try to search by OEIS ID directly
      if (searchTerm.match(/^A\d+$/i)) {
        const { data: exactMatch, error: exactError } = await supabase
          .from("oeis_sequences")
          .select("*")
          .ilike("oeis_id", searchTerm)
          .limit(1);

        if (exactError) throw exactError;

        if (exactMatch && exactMatch.length > 0) {
          setResults(exactMatch);
          setLoading(false);
          return;
        }
      }

      // If not found by ID or not an ID search, perform a broader search
      const { data, error } = await supabase
        .from("oeis_sequences")
        .select("*")
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,values.ilike.%${searchTerm}%`)
        .limit(20);

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error("Error searching sequences:", error);
      toast.error("Failed to search sequences");
    } finally {
      setLoading(false);
    }
  };

  const importSequence = async () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a sequence ID (e.g., A000045)");
      return;
    }

    setLoading(true);
    try {
      // Extract the sequence number (e.g., "45" from "A000045")
      const match = searchTerm.match(/A0*(\d+)$/i);
      if (!match) {
        toast.error("Invalid OEIS ID format. Expected format: A followed by digits (e.g., A000045)");
        return;
      }

      const sequenceNumber = parseInt(match[1]);
      
      const response = await supabase.functions.invoke("import-oeis-sequences", {
        body: { start: sequenceNumber, count: 1 }
      });

      if (response.error) throw new Error(response.error);
      
      toast.success(`Successfully imported sequence ${searchTerm}`);
      
      // Refresh search to show the imported sequence
      const { data, error } = await supabase
        .from("oeis_sequences")
        .select("*")
        .eq("oeis_id", searchTerm.toUpperCase())
        .limit(1);

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error("Error importing sequence:", error);
      toast.error(`Failed to import sequence: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const bulkImportSequences = async () => {
    if (isNaN(startId) || isNaN(count) || startId < 1 || count < 1 || count > 10000) {
      toast.error("Please enter valid start ID (≥ 1) and count (1-10000)");
      return;
    }

    setImporting(true);
    setProgress(0);
    
    try {
      toast.info(`Starting bulk import of ${count} sequences...`);
      
      // Use the Supabase Edge Function to handle the bulk import
      const response = await supabase.functions.invoke("import-oeis-sequences", {
        body: { 
          start: parseInt(startId.toString()), 
          count: parseInt(count.toString()),
          bulkImport: true
        }
      });

      if (response.error) throw new Error(response.error);
      
      const result = response.data;
      
      if (result.success) {
        toast.success(`Successfully imported ${result.totalImported} OEIS sequences`);
        // Refresh the total count
        const { count: newTotal, error } = await supabase
          .from('oeis_sequences')
          .select('*', { count: 'exact', head: true });
        
        if (!error) {
          setTotalSequences(newTotal || 0);
        }
      } else {
        throw new Error(result.message || "Unknown error during bulk import");
      }
    } catch (error) {
      console.error("Error during bulk import:", error);
      toast.error(`Bulk import failed: ${error.message}`);
    } finally {
      setImporting(false);
      setProgress(100); // Set to 100% when complete (success or error)
    }
  };

  // For the mock progress indicator (since we can't get real-time progress from the edge function)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (importing && progress < 95) {
      interval = setInterval(() => {
        setProgress(prev => {
          const increment = Math.random() * 5;
          return Math.min(prev + increment, 95);
        });
      }, 2000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [importing, progress]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>OEIS Sequence Explorer</CardTitle>
        <CardDescription>
          Search and import sequences from the Online Encyclopedia of Integer Sequences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="search" value={activeTab} onValueChange={(value) => setActiveTab(value as "search" | "import" | "bulk")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="import">Import Single</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
          </TabsList>
          
          <div className="mt-4 text-sm text-muted-foreground">
            Total OEIS sequences in database: <span className="font-medium">{totalSequences}</span>
          </div>
          
          <TabsContent value="search" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search by ID, name, description or values"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchSequences()}
              />
              <Button onClick={searchSequences} disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
            
            <div className="space-y-4 mt-4">
              {results.length > 0 ? (
                results.map((sequence) => (
                  <SequenceCard key={sequence.id} sequence={sequence} />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {loading ? "Searching..." : "No results found"}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="import" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sequence-id">OEIS Sequence ID</Label>
              <div className="flex gap-2">
                <Input
                  id="sequence-id"
                  placeholder="e.g., A000045 (Fibonacci numbers)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && importSequence()}
                />
                <Button onClick={importSequence} disabled={loading}>
                  {loading ? "Importing..." : "Import"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter an OEIS sequence ID to import it from the Online Encyclopedia of Integer Sequences.
              </p>
            </div>
            
            <div className="space-y-4 mt-4">
              {results.length > 0 ? (
                results.map((sequence) => (
                  <SequenceCard key={sequence.id} sequence={sequence} />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {loading ? "Importing..." : "No sequence imported yet"}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="bulk" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-id">Start Sequence ID</Label>
                  <Input
                    id="start-id"
                    type="number"
                    placeholder="e.g., 1"
                    value={startId}
                    onChange={(e) => setStartId(parseInt(e.target.value) || 1)}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="count">Number of Sequences</Label>
                  <Input
                    id="count"
                    type="number"
                    placeholder="e.g., 100"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 10)}
                    min="1"
                    max="10000"
                  />
                </div>
              </div>
              <Button 
                onClick={bulkImportSequences} 
                disabled={importing} 
                className="w-full"
              >
                {importing ? "Importing..." : "Start Bulk Import"}
              </Button>
              <p className="text-sm text-muted-foreground">
                Warning: Bulk importing many sequences may take several minutes. For testing, start with a small count.
              </p>
              
              {importing && (
                <div className="space-y-2">
                  <Label>Import Progress (Estimated)</Label>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground">
                    This may take a while for large imports. Please be patient.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Source: <a href="https://oeis.org" target="_blank" rel="noopener noreferrer" className="underline">The Online Encyclopedia of Integer Sequences</a>
        </p>
      </CardFooter>
    </Card>
  );
}
