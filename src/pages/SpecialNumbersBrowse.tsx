
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Calculator, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SpecialNumber {
  id: string;
  number: string;
  name: string;
  description: string;
  formula: string;
  author: string;
  created_at: string;
}

const SpecialNumbersBrowse = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [numbers, setNumbers] = useState<SpecialNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredNumbers, setFilteredNumbers] = useState<SpecialNumber[]>([]);

  useEffect(() => {
    fetchSpecialNumbers();
  }, []);

  useEffect(() => {
    // Filter numbers when search term changes
    if (searchTerm.trim() === "") {
      setFilteredNumbers(numbers);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = numbers.filter(
        num =>
          num.number.toLowerCase().includes(lowercaseSearch) ||
          num.name.toLowerCase().includes(lowercaseSearch) ||
          num.description.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredNumbers(filtered);
    }
  }, [searchTerm, numbers]);

  const fetchSpecialNumbers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("special_numbers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNumbers(data || []);
      setFilteredNumbers(data || []);
    } catch (error: any) {
      console.error("Error fetching special numbers:", error);
      toast("Failed to load numbers", {
        description: error.message || "Could not load the special numbers dictionary."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-gray-900 to-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6 text-amber-300 hover:text-amber-200"
          onClick={() => navigate("/special-numbers")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Submit
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-300 mb-2">Special Numbers Dictionary</h1>
          <p className="text-amber-200/80">
            Explore our collection of numbers with fascinating mathematical properties
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Search by number, name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border-amber-700/30 text-amber-100 placeholder:text-amber-100/50"
          />
          <Button
            variant="outline"
            className="text-amber-300 border-amber-700/30 hover:bg-amber-900/20 hover:text-amber-200"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-amber-300">Loading special numbers...</p>
          </div>
        ) : filteredNumbers.length === 0 ? (
          <div className="text-center py-10 bg-gray-900/50 rounded-lg border border-amber-700/20">
            <BookOpen className="h-12 w-12 text-amber-500/30 mx-auto" />
            <p className="mt-4 text-amber-300">No special numbers found</p>
            <p className="text-amber-200/70">Try a different search or be the first to add one!</p>
            <Button
              className="mt-4 bg-amber-600 hover:bg-amber-700 text-white"
              onClick={() => navigate("/special-numbers")}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Submit a Number
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNumbers.map((num) => (
              <Card key={num.id} className="border-amber-600/20 bg-gradient-to-b from-gray-900 to-gray-950 shadow-lg shadow-amber-900/10">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl text-amber-300">{num.number}</CardTitle>
                      <CardDescription className="text-amber-200">
                        {num.name}
                      </CardDescription>
                    </div>
                    <div className="px-2 py-1 bg-amber-900/30 rounded text-xs text-amber-200 whitespace-nowrap">
                      {new Date(num.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-amber-200/80 mb-2">{num.description}</p>
                  {num.formula && (
                    <div className="p-2 bg-gray-800/50 rounded font-mono text-xs text-amber-300/70 overflow-x-auto">
                      {num.formula}
                    </div>
                  )}
                  <div className="mt-2 text-xs text-amber-400">
                    Added by: {num.author === "guest" ? "Guest" : num.author.substring(0, 8)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialNumbersBrowse;
