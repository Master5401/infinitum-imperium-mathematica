import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, Search } from "lucide-react";
import { motion } from "framer-motion";
import { SequenceCard } from "@/components/SequenceCard"; // Fix: Change from default import to named import

interface OEISSequence {
  id: string;
  oeis_id: string;
  name: string;
  description: string;
  values: string;
  formula: string | null;
  source: string | null;
  is_public: boolean | null;
  created_at: string | null;
}

export function OEISSequenceSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<OEISSequence[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchTerm) {
      toast({
        title: "Please enter a search term",
        description: "You must enter a sequence to search for it.",
      });
      return;
    }

    setIsLoading(true);
    setProgress(30);

    try {
      const { data, error } = await supabase
        .from("oeis_sequences")
        .select("*")
        .ilike("values", `%${searchTerm}%`)
        .limit(5);

      if (error) {
        throw new Error(error.message);
      }

      setSearchResults(data || []);
      setProgress(70);
    } catch (error: any) {
      toast({
        title: "Error searching sequences",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const handleImportSequence = async (oeisId: string) => {
    setIsLoading(true);
    setProgress(30);

    try {
      const { data, error } = await supabase.functions.invoke("import-oeis-sequence", {
        body: { oeis_id: oeisId },
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Sequence imported successfully!",
        description: `Sequence ${oeisId} has been imported.`,
      });
      setProgress(70);
    } catch (error: any) {
      toast({
        title: "Error importing sequence",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }
  };

  return (
    <Card className="w-full">
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
        </TabsList>
        <TabsContent value="search">
          <div className="grid gap-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Enter a sequence (e.g., 1, 1, 2, 3, 5)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button
                onClick={handleSearch}
                className="absolute right-1 top-1 rounded-md"
                variant="outline"
                disabled={isLoading}
              >
                {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Search
              </Button>
            </div>
            {progress > 0 && <Progress value={progress} />}
            {searchResults.length > 0 && (
              <div className="grid gap-4">
                {searchResults.map((sequence) => (
                  <motion.div
                    key={sequence.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SequenceCard sequence={sequence} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="import">
          <div className="grid gap-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Enter OEIS ID (e.g., A000045)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button
                onClick={() => handleImportSequence(searchTerm)}
                className="absolute right-1 top-1 rounded-md"
                variant="outline"
                disabled={isLoading}
              >
                {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Import
              </Button>
            </div>
            {progress > 0 && <Progress value={progress} />}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
