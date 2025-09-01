import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MessageSquare, 
  Plus, 
  Heart, 
  Calendar,
  Tag,
  Users,
  HelpCircle,
  ShoppingCart,
  Lightbulb,
  Search
} from "lucide-react";
import { getCommunityPosts, createCommunityPost, likeCommunityPost } from "@/lib/api";
import { useLanguage } from "@/components/language-provider";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

// Mock user ID for demo
const DEMO_USER_ID = "demo-user-123";

interface NewPostData {
  title: string;
  content: string;
  category: string;
  tags: string;
}

export default function Community() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPost, setNewPost] = useState<NewPostData>({
    title: "",
    content: "",
    category: "",
    tags: ""
  });
  const { t } = useLanguage();
  const { toast } = useToast();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/community", activeCategory === "all" ? undefined : activeCategory],
    queryFn: () => getCommunityPosts(activeCategory === "all" ? undefined : activeCategory),
  });

  const createPostMutation = useMutation({
    mutationFn: createCommunityPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community"] });
      setShowNewPostModal(false);
      setNewPost({ title: "", content: "", category: "", tags: "" });
      toast({
        title: "Post Created",
        description: "Your post has been shared with the community.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Create Post",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const likeMutation = useMutation({
    mutationFn: likeCommunityPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community"] });
    },
  });

  const categories = [
    { id: "all", label: "All Posts", icon: MessageSquare },
    { id: "tips", label: "Farming Tips", icon: Lightbulb },
    { id: "questions", label: "Questions", icon: HelpCircle },
    { id: "trade", label: "Buy/Sell", icon: ShoppingCart },
  ];

  const filteredPosts = posts?.filter((post: any) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content || !newPost.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createPostMutation.mutate({
      userId: DEMO_USER_ID,
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      tags: newPost.tags.split(",").map(tag => tag.trim()).filter(Boolean)
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "tips": return <Lightbulb className="w-4 h-4" />;
      case "questions": return <HelpCircle className="w-4 h-4" />;
      case "trade": return <ShoppingCart className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "tips": return "bg-primary text-primary-foreground";
      case "questions": return "bg-secondary text-secondary-foreground";
      case "trade": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Community Forum</h1>
          <p className="text-xl text-muted-foreground">
            Connect with fellow farmers, share knowledge, and grow together
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveCategory(category.id)}
                      data-testid={`category-${category.id}`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {category.label}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Create Post */}
            <Dialog open={showNewPostModal} onOpenChange={setShowNewPostModal}>
              <DialogTrigger asChild>
                <Button className="w-full" data-testid="button-create-post">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitPost} className="space-y-4">
                  <div>
                    <Label htmlFor="postTitle">Title</Label>
                    <Input
                      id="postTitle"
                      placeholder="Enter post title"
                      value={newPost.title}
                      onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                      data-testid="input-post-title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postCategory">Category</Label>
                    <Select value={newPost.category} onValueChange={(value) => setNewPost(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger data-testid="select-post-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tips">Farming Tips</SelectItem>
                        <SelectItem value="questions">Questions</SelectItem>
                        <SelectItem value="trade">Buy/Sell</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="postContent">Content</Label>
                    <Textarea
                      id="postContent"
                      placeholder="Share your thoughts, questions, or tips..."
                      value={newPost.content}
                      onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                      rows={4}
                      data-testid="textarea-post-content"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postTags">Tags (comma-separated)</Label>
                    <Input
                      id="postTags"
                      placeholder="e.g. organic, wheat, irrigation"
                      value={newPost.tags}
                      onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                      data-testid="input-post-tags"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      type="submit" 
                      disabled={createPostMutation.isPending}
                      data-testid="button-submit-post"
                    >
                      {createPostMutation.isPending ? "Posting..." : "Post"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setShowNewPostModal(false)}
                      data-testid="button-cancel-post"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Members</span>
                  <span className="font-medium" data-testid="stat-members">2,847</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Posts Today</span>
                  <span className="font-medium" data-testid="stat-posts-today">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Active Now</span>
                  <span className="font-medium" data-testid="stat-active-now">156</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-posts"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Posts List */}
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="flex space-x-2">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((post: any, index: number) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-2" data-testid={`post-title-${index}`}>
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-3" data-testid={`post-content-${index}`}>
                            {post.content}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge className={getCategoryColor(post.category)}>
                            {getCategoryIcon(post.category)}
                            <span className="ml-1 capitalize">{post.category}</span>
                          </Badge>
                          
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex items-center space-x-1">
                              {post.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                                <Badge key={tagIndex} variant="outline" className="text-xs">
                                  <Tag className="w-3 h-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => likeMutation.mutate(post.id)}
                            disabled={likeMutation.isPending}
                            data-testid={`button-like-${index}`}
                          >
                            <Heart className="w-4 h-4 mr-1" />
                            {post.likes || 0}
                          </Button>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span data-testid={`post-date-${index}`}>
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Posts Found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm ? "No posts match your search." : "Be the first to start a conversation!"}
                    </p>
                    <Button onClick={() => setShowNewPostModal(true)} data-testid="button-create-first-post">
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Post
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sample Community Posts for Demo */}
            {!isLoading && (!posts || posts.length === 0) && (
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Best practices for organic wheat farming?
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      I'm transitioning to organic wheat farming this season. Looking for advice on 
                      natural fertilizers and pest control methods that have worked well for others.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-secondary text-secondary-foreground">
                          <HelpCircle className="w-3 h-3 mr-1" />
                          Questions
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          organic
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          wheat
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" data-testid="demo-like-1">
                          <Heart className="w-4 h-4 mr-1" />
                          12
                        </Button>
                        <span className="text-xs text-muted-foreground">2 days ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Successfully increased tomato yield by 40% using IoT sensors
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      Sharing my experience with soil moisture sensors and automated irrigation. 
                      The investment paid off within one season. Happy to answer questions!
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-primary text-primary-foreground">
                          <Lightbulb className="w-3 h-3 mr-1" />
                          Tips
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          IoT
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          tomato
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" data-testid="demo-like-2">
                          <Heart className="w-4 h-4 mr-1" />
                          28
                        </Button>
                        <span className="text-xs text-muted-foreground">1 week ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Selling premium quality rice - 500kg available
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      Organic basmati rice from my farm in Punjab. Certified organic, 
                      excellent quality. Looking for bulk buyers. Contact for samples.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-accent text-accent-foreground">
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Trade
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          rice
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          organic
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" data-testid="demo-like-3">
                          <Heart className="w-4 h-4 mr-1" />
                          7
                        </Button>
                        <span className="text-xs text-muted-foreground">3 days ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
