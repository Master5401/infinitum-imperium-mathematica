
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Calculator, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type SpecialNumber = Database['public']['Tables']['special_numbers']['Row'];

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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-slate-800 hover:bg-white/50 dark:text-slate-300 dark:hover:text-slate-100"
            onClick={() => navigate("/special-numbers")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Submit
          </Button>
          
          <Button
            variant="outline"
            className="text-teal-600 border-teal-200 hover:bg-teal-50 dark:text-teal-400 dark:border-teal-600 dark:hover:bg-teal-900/20"
            onClick={() => navigate("/special-numbers")}
          >
            <Calculator className="h-4 w-4 mr-2" />
            Submit a Number
          </Button>
        </div>

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            Special Numbers Dictionary
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Explore our curated collection of numbers with fascinating mathematical properties
          </p>
        </div>

        <div className="flex gap-3 mb-8 max-w-2xl mx-auto">
          <Input
            placeholder="Search by number, name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 h-12"
          />
          <Button
            variant="outline"
            className="text-teal-600 border-teal-200 hover:bg-teal-50 dark:text-teal-400 dark:border-teal-600 dark:hover:bg-teal-900/20 px-6"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin h-10 w-10 border-4 border-teal-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-6 text-slate-600 dark:text-slate-400 text-lg">Loading special numbers...</p>
          </div>
        ) : filteredNumbers.length === 0 ? (
          <div className="text-center py-16 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-teal-200 dark:border-slate-600 backdrop-blur-sm">
            <BookOpen className="h-16 w-16 text-teal-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">No special numbers found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Try a different search or be the first to add one!</p>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => navigate("/special-numbers")}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Submit a Number
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredNumbers.map((num) => (
              <Card key={num.id} className="border-teal-200 bg-white/80 dark:border-slate-600 dark:bg-slate-800/80 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <CardTitle className="text-2xl text-teal-700 dark:text-teal-400 font-bold">{num.number}</CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400 font-medium text-base">
                        {num.name}
                      </CardDescription>
                    </div>
                    <div className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 rounded-full text-xs text-teal-700 dark:text-teal-300 whitespace-nowrap">
                      {new Date(num.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">{num.description}</p>
                  {num.formula && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-md font-mono text-xs text-slate-700 dark:text-slate-300 overflow-x-auto border border-slate-200 dark:border-slate-600">
                      {num.formula}
                    </div>
                  )}
                  <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    Added by: <span className="font-medium">{num.author === "guest" ? "Guest" : num.author.substring(0, 8)}</span>
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
