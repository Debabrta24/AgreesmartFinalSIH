import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus, Search, IndianRupee, AlertTriangle } from "lucide-react";
import { getMarketPrices } from "@/lib/api";
import { useLanguage } from "@/components/language-provider";

export default function PriceTracker() {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useLanguage();

  const { data: marketPrices, isLoading, error } = useQuery({
    queryKey: ["/api/market-prices"],
    queryFn: () => getMarketPrices(),
  });

  const filteredPrices = marketPrices?.filter((price: any) =>
    price.cropName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-primary" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-primary";
      case "down":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Market Price Tracker</h1>
          <p className="text-xl text-muted-foreground">
            Real-time crop prices and market insights
          </p>
        </div>

        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search crops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-crops"
                />
              </div>
            </CardContent>
          </Card>

          {/* Market Overview Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-2">₹2.1L</div>
                <div className="text-sm text-muted-foreground">Avg Daily Trading</div>
                <div className="text-xs text-primary mt-1">↗ 5.2%</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-secondary mb-2">24</div>
                <div className="text-sm text-muted-foreground">Active Markets</div>
                <div className="text-xs text-muted-foreground mt-1">→ 0%</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-accent mb-2">89%</div>
                <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
                <div className="text-xs text-accent mt-1">↗ 2.1%</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-2">15+</div>
                <div className="text-sm text-muted-foreground">Supported Crops</div>
                <div className="text-xs text-primary mt-1">↗ 3 new</div>
              </CardContent>
            </Card>
          </div>

          {/* Price Table */}
          <Card>
            <CardHeader>
              <CardTitle>Current Market Prices</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <div className="text-right space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
                  <p className="text-muted-foreground">Failed to load market prices</p>
                  <p className="text-xs text-muted-foreground mt-1">Please try again later</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredPrices.map((price: any, index: number) => (
                    <div 
                      key={price.id || index} 
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-primary font-semibold text-sm">
                            {price.cropName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground" data-testid={`crop-name-${index}`}>
                            {price.cropName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {price.market} • {price.location}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <IndianRupee className="w-4 h-4 text-muted-foreground" />
                          <span className="text-lg font-semibold text-foreground" data-testid={`price-value-${index}`}>
                            {price.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground">/{price.unit}</span>
                        </div>
                        <div className={`flex items-center justify-end space-x-1 text-sm ${getTrendColor(price.trend)}`}>
                          {getTrendIcon(price.trend)}
                          <span data-testid={`price-trend-${index}`}>
                            {Math.abs(price.trendPercentage || 0).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredPrices.length === 0 && (
                    <div className="text-center py-8">
                      <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No crops found matching your search</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Market Insights */}
          <Card>
            <CardHeader>
              <CardTitle>AI Market Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <h4 className="font-medium text-foreground mb-2">Best Time to Sell</h4>
                  <p className="text-sm text-muted-foreground">
                    Wheat prices expected to rise 8% in next 2 weeks due to export demand
                  </p>
                </div>
                <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                  <h4 className="font-medium text-foreground mb-2">Market Opportunity</h4>
                  <p className="text-sm text-muted-foreground">
                    Organic vegetables showing 15% premium in metro markets
                  </p>
                </div>
                <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <h4 className="font-medium text-foreground mb-2">Risk Alert</h4>
                  <p className="text-sm text-muted-foreground">
                    Monsoon delays may affect rice prices in coming month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
