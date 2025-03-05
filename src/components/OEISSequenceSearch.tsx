
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Database, RefreshCw, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OEISSequence {
  id: string;
  oeis_id: string;
  name: string;
  description: string;
  values: string;
  formula: string | null;
}

export const OEISSequenceSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [sequences, setSequences] = useState<OEISSequence[]>([]);
  const [currentTab, setCurrentTab] = useState("search");
  const [importParams, setImportParams] = useState({ start: 1, count: 100 });

  // Search for sequences in our database
  const searchSequences = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      // Use a type-safe approach with explicit cast
      const { data, error } = await supabase
        .from('oeis_sequences')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,values.ilike.%${searchTerm}%`)
        .limit(50);
      
      if (error) throw error;
      
      if (data) {
        setSequences(data as unknown as OEISSequence[]);
      }
      
      if (!data || data.length === 0) {
        toast.info("No sequences found matching your search.");
      }
    } catch (error) {
      console.error("Error searching sequences:", error);
      toast.error("Failed to search sequences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Import sequences from OEIS
  const importSequences = async () => {
    setImportLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('import-oeis-sequences', {
        body: importParams
      });
      
      if (error) throw error;
      
      toast.success(`Successfully imported sequences`);
      if (data && data.message) {
        toast.success(data.message);
      }
      
      // Refresh the search if we're already searching for something
      if (searchTerm) {
        searchSequences();
      }
    } catch (error) {
      console.error("Error importing sequences:", error);
      toast.error("Failed to import sequences. Please try again later.");
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Tabs defaultValue="search" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-2 bg-[#2A2D3A]/50 rounded-lg border border-amber-900/20">
          <TabsTrigger 
            value="search" 
            className="text-amber-300 data-[state=active]:bg-amber-900/20 data-[state=active]:text-amber-200"
          >
            <Search className="h-4 w-4 mr-2" />
            Search Sequences
          </TabsTrigger>
          <TabsTrigger 
            value="import" 
            className="text-amber-300 data-[state=active]:bg-amber-900/20 data-[state=active]:text-amber-200"
          >
            <Database className="h-4 w-4 mr-2" />
            Import from OEIS
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="mt-6">
          <Card className="bg-[#1b1c22]/80 border-amber-900/30 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 bg-clip-text text-transparent">
                OEIS Sequence Search
              </CardTitle>
              <CardDescription className="text-amber-100/60">
                Search for mathematical sequences from the Online Encyclopedia of Integer Sequences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search by name, description, or values..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchSequences()}
                  className="bg-[#2A2D3A]/50 border-amber-900/30 text-amber-100 placeholder:text-amber-900/50"
                />
                <Button 
                  onClick={searchSequences} 
                  disabled={loading}
                  className="bg-amber-900 hover:bg-amber-800 text-amber-100"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
              
              <AnimatePresence>
                <motion.div className="mt-6 space-y-4">
                  {sequences.length > 0 ? (
                    sequences.map((sequence) => (
                      <motion.div
                        key={sequence.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="bg-[#2A2D3A]/70 border-amber-900/20 hover:border-amber-900/40 transition-all duration-300">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg text-amber-300">
                                  {sequence.name}
                                </CardTitle>
                                <CardDescription className="text-amber-100/70">
                                  {sequence.oeis_id}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-sm text-amber-100/80 mb-2">{sequence.description}</p>
                            <div className="bg-[#1A1B25]/80 p-2 rounded-md border border-amber-900/20 overflow-x-auto">
                              <code className="text-xs font-mono text-amber-200">{sequence.values}</code>
                            </div>
                            {sequence.formula && (
                              <div className="mt-2">
                                <span className="text-xs font-medium text-amber-300">Formula: </span>
                                <span className="text-xs font-mono text-amber-200">{sequence.formula}</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  ) : searchTerm ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                      <p className="text-amber-300">No sequences found. Try a different search term or import more sequences.</p>
                    </motion.div>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="import" className="mt-6">
          <Card className="bg-[#1b1c22]/80 border-amber-900/30 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 bg-clip-text text-transparent">
                Import OEIS Sequences
              </CardTitle>
              <CardDescription className="text-amber-100/60">
                Import sequences from the Online Encyclopedia of Integer Sequences into our database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-amber-300 mb-1">
                    Starting Sequence Number
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={importParams.start}
                    onChange={(e) => setImportParams({ ...importParams, start: parseInt(e.target.value) || 1 })}
                    className="bg-[#2A2D3A]/50 border-amber-900/30 text-amber-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-300 mb-1">
                    Number of Sequences to Import
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="500"
                    value={importParams.count}
                    onChange={(e) => setImportParams({ ...importParams, count: parseInt(e.target.value) || 100 })}
                    className="bg-[#2A2D3A]/50 border-amber-900/30 text-amber-100"
                  />
                </div>
              </div>
              
              <Button 
                onClick={importSequences} 
                disabled={importLoading} 
                className="w-full bg-amber-900 hover:bg-amber-800 text-amber-100"
              >
                {importLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Importing Sequences...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Import Sequences
                  </>
                )}
              </Button>
              
              <div className="mt-4 p-4 bg-amber-900/10 rounded-lg border border-amber-900/20">
                <h3 className="text-sm font-medium text-amber-300 mb-2">How It Works</h3>
                <ul className="text-xs text-amber-100/80 space-y-1 list-disc list-inside">
                  <li>This process fetches sequences from OEIS and stores them in our database</li>
                  <li>Start with a sequence number (e.g., 1 for A000001)</li>
                  <li>Specify how many sequences to import (max 500 at once)</li>
                  <li>After import, you can search for the sequences in the Search tab</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};
