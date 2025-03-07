
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Search, Share2, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SequenceCard } from "@/components/SequenceCard";

interface OEISSequence {
  id: string;
  oeis_id: string;
  name: string;
  description: string;
  values: string;
  formula?: string;
  source?: string;
}

const OEISSequenceSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchResults, setSearchResults] = useState<OEISSequence[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast("Please enter a search term");
      return;
    }

    setIsSearching(true);
    setSearchProgress(10);
    
    try {
      // Add to recent searches if not already there
      if (!recentSearches.includes(searchTerm)) {
        setRecentSearches(prev => [searchTerm, ...prev].slice(0, 5));
      }
      
      setSearchProgress(30);
      
      const { data, error } = await supabase
        .from("oeis_sequences")
        .select("*")
        .ilike("name", `%${searchTerm}%`)
        .limit(20);
      
      setSearchProgress(70);
      
      if (error) throw error;
      
      setSearchProgress(100);
      setSearchResults(data || []);
      
      if (data && data.length === 0) {
        toast("No results found", {
          description: "Try different search terms or keywords"
        });
      }
    } catch (error: any) {
      console.error("Search error:", error);
      toast("Search failed", {
        description: error.message
      });
    } finally {
      setTimeout(() => {
        setIsSearching(false);
        setSearchProgress(0);
      }, 500);
    }
  };

  const handleRecentSearchClick = (term: string) => {
    setSearchTerm(term);
    handleSearch();
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Search for mathematical sequences..."
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
          {isSearching ? (
            <span className="flex items-center">
              <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
              Searching
            </span>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search
            </>
          )}
        </Button>
        {searchResults.length > 0 && (
          <Button
            variant="outline"
            onClick={clearSearch}
            className="text-amber-300 border-amber-700/30 hover:bg-amber-900/20 hover:text-amber-200"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {isSearching && (
        <div className="mb-6">
          <Progress value={searchProgress} className="h-2 bg-gray-700" />
          <p className="text-xs text-amber-300/70 mt-1">Searching OEIS database...</p>
        </div>
      )}

      {recentSearches.length > 0 && searchResults.length === 0 && !isSearching && (
        <div className="mb-6">
          <h3 className="text-amber-300 mb-2 text-sm">Recent Searches:</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm" 
                className="text-amber-200 border-amber-700/30 hover:bg-amber-900/20"
                onClick={() => handleRecentSearchClick(term)}
              >
                {term}
              </Button>
            ))}
          </div>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl text-amber-300">Search Results</h2>
            <span className="text-sm text-amber-200/70">{searchResults.length} sequences found</span>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {searchResults.map((sequence) => (
              <SequenceCard key={sequence.id} sequence={sequence} />
            ))}
          </div>
        </div>
      )}

      {!isSearching && searchResults.length === 0 && (
        <Card className="border-amber-700/20 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-amber-300">OEIS Sequence Search</CardTitle>
            <CardDescription className="text-amber-200/70">
              Search for mathematical sequences in the Online Encyclopedia of Integer Sequences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-amber-100/80">
              Enter keywords, sequence terms, or OEIS A-numbers to find sequences.
              Try searching for terms like "Fibonacci", "prime", or "A000045".
            </p>
          </CardContent>
          <CardFooter className="text-xs text-amber-200/60 border-t border-amber-700/10 pt-4">
            <Share2 className="h-3 w-3 mr-1" /> Data sourced from the Online Encyclopedia of Integer Sequences® (OEIS®)
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default OEISSequenceSearch;
