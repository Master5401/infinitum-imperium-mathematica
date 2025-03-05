
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Database, RefreshCw, AlertTriangle, CheckCircle, BarChart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface OEISSequence {
  id: string;
  oeis_id: string;
  name: string;
  description: string;
  values: string;
  formula: string | null;
  source: string;
}

export const OEISSequenceSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [bulkImportLoading, setBulkImportLoading] = useState(false);
  const [sequences, setSequences] = useState<OEISSequence[]>([]);
  const [currentTab, setCurrentTab] = useState("search");
  const [importParams, setImportParams] = useState({ start: 1, count: 100 });
  const [bulkImportParams, setBulkImportParams] = useState({ start: 1, count: 1000 });
  const [importProgress, setImportProgress] = useState(0);
  const [totalSequences, setTotalSequences] = useState(0);

  useEffect(() => {
    // Get the count of sequences in the database
    const fetchSequenceCount = async () => {
      try {
        const { count, error } = await supabase
          .from('oeis_sequences')
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        
        if (count !== null) {
          setTotalSequences(count);
        }
      } catch (error) {
        console.error("Error fetching sequence count:", error);
      }
    };

    fetchSequenceCount();
  }, [importLoading, bulkImportLoading]);

  // Search for sequences in our database
  const searchSequences = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('oeis_sequences')
        .select('*');
      
      // Check if the search term is an OEIS ID (starts with 'A' followed by digits)
      if (/^A\d+$/i.test(searchTerm)) {
        query = query.ilike('oeis_id', searchTerm);
      } else {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,values.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query.limit(50);
      
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

  // Bulk import sequences from OEIS
  const bulkImportSequences = async () => {
    setBulkImportLoading(true);
    setImportProgress(0);
    
    try {
      // Add bulkImport flag for the edge function
      const { data, error } = await supabase.functions.invoke('import-oeis-sequences', {
        body: { ...bulkImportParams, bulkImport: true }
      });
      
      if (error) throw error;
      
      if (data && data.message) {
        toast.success(data.message);
      }
      
      // Final progress update
      setImportProgress(100);
      toast.success(`Bulk import completed successfully!`);
    } catch (error) {
      console.error("Error with bulk import:", error);
      toast.error("Failed to complete bulk import. Please try again later.");
    } finally {
      setBulkImportLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSequences([]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Tabs defaultValue="search" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-3 bg-[#2A2D3A]/50 rounded-lg border border-amber-900/20">
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
            Import Sequences
          </TabsTrigger>
          <TabsTrigger 
            value="bulk-import" 
            className="text-amber-300 data-[state=active]:bg-amber-900/20 data-[state=active]:text-amber-200"
          >
            <BarChart className="h-4 w-4 mr-2" />
            Bulk Import
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
              <div className="text-sm text-amber-300">
                Total sequences in database: <span className="font-semibold">{totalSequences}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search by name, description, or values (e.g. A000045 for Fibonacci)"
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
                {sequences.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={clearSearch}
                    className="border-amber-900/30 text-amber-300 hover:bg-amber-900/10"
                  >
                    Clear
                  </Button>
                )}
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
                                <div className="flex items-center">
                                  <CardDescription className="text-amber-100/70">
                                    {sequence.oeis_id}
                                  </CardDescription>
                                  <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-amber-900/30 text-amber-200 rounded-full">
                                    {sequence.source || "OEIS"}
                                  </span>
                                </div>
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
                Import specific sequences from the Online Encyclopedia of Integer Sequences
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

        <TabsContent value="bulk-import" className="mt-6">
          <Card className="bg-[#1b1c22]/80 border-amber-900/30 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 bg-clip-text text-transparent">
                Bulk Import OEIS Sequences
              </CardTitle>
              <CardDescription className="text-amber-100/60">
                Import large batches of sequences from the Online Encyclopedia of Integer Sequences
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
                    value={bulkImportParams.start}
                    onChange={(e) => setBulkImportParams({ ...bulkImportParams, start: parseInt(e.target.value) || 1 })}
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
                    max="10000"
                    value={bulkImportParams.count}
                    onChange={(e) => setBulkImportParams({ ...bulkImportParams, count: parseInt(e.target.value) || 1000 })}
                    className="bg-[#2A2D3A]/50 border-amber-900/30 text-amber-100"
                  />
                  <p className="text-xs text-amber-100/60 mt-1">Up to 10,000 sequences at once</p>
                </div>
              </div>
              
              {bulkImportLoading && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-amber-300">Import progress</span>
                    <span className="text-sm text-amber-300">{importProgress}%</span>
                  </div>
                  <Progress value={importProgress} className="h-2 bg-amber-900/20" indicatorClassName="bg-amber-500" />
                </div>
              )}
              
              <Button 
                onClick={bulkImportSequences} 
                disabled={bulkImportLoading} 
                className="w-full bg-amber-900 hover:bg-amber-800 text-amber-100"
              >
                {bulkImportLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Bulk Importing Sequences...
                  </>
                ) : (
                  <>
                    <BarChart className="h-4 w-4 mr-2" />
                    Start Bulk Import
                  </>
                )}
              </Button>
              
              <div className="mt-4 p-4 bg-amber-900/10 rounded-lg border border-amber-900/20">
                <h3 className="text-sm font-medium text-amber-300 mb-2">Important Notes</h3>
                <ul className="text-xs text-amber-100/80 space-y-1 list-disc list-inside">
                  <li>Bulk import can take a long time to complete</li>
                  <li>The process runs on the server and continues even if you leave this page</li>
                  <li>Use this for importing large ranges of sequences (e.g., the first 10,000)</li>
                  <li>If the import fails, try with a smaller batch size</li>
                </ul>
              </div>
              
              <div className="mt-4 flex items-center p-3 bg-amber-900/20 rounded-lg border border-amber-900/30">
                <CheckCircle className="h-5 w-5 text-amber-400 mr-2 flex-shrink-0" />
                <p className="text-sm text-amber-100">
                  Currently <span className="font-semibold text-amber-300">{totalSequences}</span> sequences are stored in the database.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};
