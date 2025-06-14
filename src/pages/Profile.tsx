
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive"
        });
      } else {
        setProfile(data);
        setUsername(data.username || "");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ username })
        .eq('user_id', profile.user_id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });

      setProfile({ ...profile, username });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-gray-800/50 border-amber-500/30">
          <CardContent className="text-center p-6">
            <p className="text-amber-300">Profile not found</p>
            <Button 
              onClick={() => navigate("/")}
              className="mt-4 bg-amber-600 hover:bg-amber-700"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 text-amber-300 hover:text-amber-200"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="bg-gray-800/50 border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-2xl text-amber-300 flex items-center">
              <User className="h-6 w-6 mr-2" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username" className="text-amber-100">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-gray-700 border-amber-700/30 text-amber-100"
                  />
                </div>
                
                <div>
                  <Label className="text-amber-100">Level</Label>
                  <div className="text-2xl font-bold text-amber-400">{profile.level}</div>
                </div>

                <div>
                  <Label className="text-amber-100">Title</Label>
                  <div className="text-lg text-amber-300">{profile.title}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-amber-100">Experience Points</Label>
                  <div className="text-xl font-semibold text-blue-400">{profile.experience_points}</div>
                </div>

                <div>
                  <Label className="text-amber-100">Mystical Essence</Label>
                  <div className="text-xl font-semibold text-purple-400">{profile.mystical_essence}</div>
                </div>

                <div>
                  <Label className="text-amber-100">Sequences Submitted</Label>
                  <div className="text-lg text-amber-300">{profile.total_sequences_submitted}</div>
                </div>

                <div>
                  <Label className="text-amber-100">Challenges Completed</Label>
                  <div className="text-lg text-amber-300">{profile.total_challenges_completed}</div>
                </div>

                <div>
                  <Label className="text-amber-100">Current Streak</Label>
                  <div className="text-lg text-orange-400">{profile.streak_days} days</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-amber-700/20">
              <Button 
                onClick={saveProfile}
                disabled={saving}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
