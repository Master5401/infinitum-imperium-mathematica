
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Fix the import to use named export
import { SequenceCard } from "@/components/SequenceCard";

// Define the OEISSequence type
interface OEISSequence {
  id: string;
  oeis_id: string;
  name: string;
  description: string;
  values: string;
  formula: string | null;
}

export function OEISSequenceSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [sequences, setSequences] = useState<OEISSequence[]>([]);
  const [importingId, setImportingId] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast("Enter a search term", {
        description: "Please enter a number sequence or keyword to search."
      });
      return;
    }

    setIsSearching(true);
    setSearchProgress(20);
    setSequences([]);

    try {
      // First, check if we already have the sequences in our database
      const { data: dbSequences, error: dbError } = await supabase
        .from("oeis_sequences")
        .select("*")
        .or(`description.ilike.%${searchTerm}%, name.ilike.%${searchTerm}%, values.ilike.%${searchTerm}%`)
        .limit(10);

      setSearchProgress(40);

      if (dbError) throw dbError;

      if (dbSequences && dbSequences.length > 0) {
        setSequences(dbSequences);
        setIsSearching(false);
        setSearchProgress(100);
        return;
      }

      // If not in our database, fetch from OEIS through our function
      setSearchProgress(60);
      
      const { data, error } = await supabase.functions.invoke('import-oeis-sequences', {
        body: { query: searchTerm }
      });

      if (error) throw error;
      
      setSearchProgress(80);
      
      if (data?.sequences && data.sequences.length > 0) {
        setSequences(data.sequences);
      } else {
        toast("No results found", {
          description: "Try a different search term or try again later."
        });
      }
    } catch (error: any) {
      console.error("Search error:", error);
      toast("Search failed", {
        description: error.message || "Failed to search sequences. Please try again later."
      });
    } finally {
      setIsSearching(false);
      setSearchProgress(100);
    }
  };

  const importSequence = async (sequence: OEISSequence) => {
    setImportingId(sequence.id);
    
    try {
      // Check if already imported
      const { data: existing } = await supabase
        .from("sequences")
        .select("id")
        .eq("title", sequence.name)
        .single();
      
      if (existing) {
        toast("Already in library", {
          description: "This sequence has already been imported to your library."
        });
        return;
      }
      
      // Import to user sequences
      const { error } = await supabase
        .from("sequences")
        .insert({
          title: sequence.name,
          description: sequence.description,
          formula: sequence.formula || `a(n) = ${sequence.values.split(',')[0]}, ${sequence.values.split(',')[1]}, ${sequence.values.split(',')[2]}, ...`,
          latex_formula: sequence.formula || `a(n) = ${sequence.values.split(',')[0]}, ${sequence.values.split(',')[1]}, ${sequence.values.split(',')[2]}, ...`,
          author: "OEIS"
        });
      
      if (error) throw error;
      
      toast("Sequence imported", {
        description: "The sequence has been added to your library."
      });
    } catch (error: any) {
      console.error("Import error:", error);
      toast("Import failed", {
        description: error.message || "Failed to import sequence. Please try again later."
      });
    } finally {
      setImportingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search by keywords or number pattern (e.g. '1, 1, 2, 3, 5')"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="bg-gray-800 border-amber-700/30 text-amber-100 placeholder:text-amber-100/50"
        />
        <Button 
          onClick={handleSearch}
          disabled={isSearching}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          {isSearching ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
          Search
        </Button>
      </div>
      
      {isSearching && (
        <Progress value={searchProgress} className="h-1 bg-gray-700" indicatorClassName="bg-amber-500" />
      )}
      
      {sequences.length > 0 && (
        <div className="space-y-4 mt-4">
          <h3 className="text-lg font-semibold text-amber-100">Search Results</h3>
          {sequences.map((sequence) => (
            <Card key={sequence.id} className="bg-gray-800 border-amber-700/30">
              <CardContent className="p-4">
                {/* Pass the sequence as a prop to SequenceCard */}
                <SequenceCard sequence={sequence} />
                
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={() => importSequence(sequence)}
                    disabled={importingId === sequence.id}
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {importingId === sequence.id ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      "Import to Library"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
