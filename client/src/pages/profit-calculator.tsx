import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  IndianRupee, 
  TrendingUp, 
  PieChart,
  FileText,
  DollarSign,
  Percent
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";

interface CostData {
  seeds: number;
  fertilizer: number;
  pesticides: number;
  labor: number;
  irrigation: number;
  equipment: number;
  other: number;
}

interface RevenueData {
  expectedYield: number;
  pricePerUnit: number;
  totalRevenue: number;
}

export default function ProfitCalculator() {
  const [cropType, setCropType] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [costs, setCosts] = useState<CostData>({
    seeds: 0,
    fertilizer: 0,
    pesticides: 0,
    labor: 0,
    irrigation: 0,
    equipment: 0,
    other: 0
  });
  const [revenue, setRevenue] = useState<RevenueData>({
    expectedYield: 0,
    pricePerUnit: 0,
    totalRevenue: 0
  });
  const { t } = useLanguage();

  const totalCosts = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
  const profit = revenue.totalRevenue - totalCosts;
  const profitMargin = revenue.totalRevenue > 0 ? ((profit / revenue.totalRevenue) * 100) : 0;
  const roi = totalCosts > 0 ? ((profit / totalCosts) * 100) : 0;

  const handleCostChange = (field: keyof CostData, value: string) => {
    setCosts(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleRevenueChange = (field: keyof RevenueData, value: string) => {
    const newRevenue = { ...revenue, [field]: parseFloat(value) || 0 };
    if (field === "expectedYield" || field === "pricePerUnit") {
      newRevenue.totalRevenue = newRevenue.expectedYield * newRevenue.pricePerUnit;
    }
    setRevenue(newRevenue);
  };

  const costCategories = [
    { key: "seeds" as keyof CostData, label: "Seeds & Planting Material", icon: "🌱" },
    { key: "fertilizer" as keyof CostData, label: "Fertilizers & Nutrients", icon: "🧪" },
    { key: "pesticides" as keyof CostData, label: "Pesticides & Protection", icon: "🛡️" },
    { key: "labor" as keyof CostData, label: "Labor Costs", icon: "👥" },
    { key: "irrigation" as keyof CostData, label: "Irrigation & Water", icon: "💧" },
    { key: "equipment" as keyof CostData, label: "Equipment & Machinery", icon: "🚜" },
    { key: "other" as keyof CostData, label: "Other Expenses", icon: "📋" }
  ];

  const subsidies = [
    { name: "PM-KISAN Scheme", amount: 6000, description: "Direct income support", eligible: true },
    { name: "Soil Health Card", amount: 1500, description: "Soil testing subsidy", eligible: true },
    { name: "Drip Irrigation", amount: 25000, description: "Water conservation subsidy", eligible: false },
    { name: "Organic Farming", amount: 8000, description: "Organic certification support", eligible: true },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Profit Calculator</h1>
          <p className="text-xl text-muted-foreground">
            AI-powered financial insights and cost optimization
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="basic" data-testid="tab-basic-info">Basic Info</TabsTrigger>
                <TabsTrigger value="costs" data-testid="tab-costs">Costs</TabsTrigger>
                <TabsTrigger value="revenue" data-testid="tab-revenue">Revenue</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle>Farm Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cropType">Crop Type</Label>
                        <Select value={cropType} onValueChange={setCropType}>
                          <SelectTrigger data-testid="select-crop-type">
                            <SelectValue placeholder="Select crop" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="wheat">Wheat</SelectItem>
                            <SelectItem value="rice">Rice</SelectItem>
                            <SelectItem value="corn">Corn</SelectItem>
                            <SelectItem value="sugarcane">Sugarcane</SelectItem>
                            <SelectItem value="cotton">Cotton</SelectItem>
                            <SelectItem value="soybean">Soybean</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="farmSize">Farm Size (Acres)</Label>
                        <Input
                          id="farmSize"
                          type="number"
                          placeholder="Enter farm size"
                          value={farmSize}
                          onChange={(e) => setFarmSize(e.target.value)}
                          data-testid="input-farm-size"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="costs">
                <Card>
                  <CardHeader>
                    <CardTitle>Cost Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {costCategories.map((category) => (
                      <div key={category.key} className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-lg">{category.icon}</span>
                        </div>
                        <div className="flex-1">
                          <Label className="text-sm font-medium">{category.label}</Label>
                        </div>
                        <div className="w-32">
                          <Input
                            type="number"
                            placeholder="₹0"
                            value={costs[category.key] || ""}
                            onChange={(e) => handleCostChange(category.key, e.target.value)}
                            data-testid={`input-cost-${category.key}`}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-border pt-4">
                      <div className="flex items-center justify-between text-lg font-semibold">
                        <span>Total Costs</span>
                        <span className="text-destructive" data-testid="total-costs">
                          ₹{totalCosts.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="revenue">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Projection</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expectedYield">Expected Yield (Quintals)</Label>
                        <Input
                          id="expectedYield"
                          type="number"
                          placeholder="Enter expected yield"
                          value={revenue.expectedYield || ""}
                          onChange={(e) => handleRevenueChange("expectedYield", e.target.value)}
                          data-testid="input-expected-yield"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pricePerUnit">Price per Quintal (₹)</Label>
                        <Input
                          id="pricePerUnit"
                          type="number"
                          placeholder="Enter market price"
                          value={revenue.pricePerUnit || ""}
                          onChange={(e) => handleRevenueChange("pricePerUnit", e.target.value)}
                          data-testid="input-price-per-unit"
                        />
                      </div>
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="flex items-center justify-between text-lg font-semibold">
                        <span>Total Revenue</span>
                        <span className="text-primary" data-testid="total-revenue">
                          ₹{revenue.totalRevenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Results Sidebar */}
          <div className="space-y-6">
            {/* Profit Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5" />
                  <span>Profit Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className={`text-3xl font-bold mb-2 ${profit >= 0 ? "text-primary" : "text-destructive"}`} data-testid="net-profit">
                    ₹{profit.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Net Profit</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Profit Margin</span>
                    <div className="flex items-center space-x-2">
                      <Percent className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium" data-testid="profit-margin">
                        {profitMargin.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">ROI</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium" data-testid="roi">
                        {roi.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Break-even Yield</span>
                    <span className="font-medium" data-testid="breakeven-yield">
                      {revenue.pricePerUnit > 0 ? (totalCosts / revenue.pricePerUnit).toFixed(1) : "0"} qt
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Government Subsidies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Available Subsidies</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {subsidies.map((subsidy, index) => (
                  <div key={index} className="p-3 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground text-sm" data-testid={`subsidy-name-${index}`}>
                        {subsidy.name}
                      </h4>
                      <Badge className={subsidy.eligible ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}>
                        {subsidy.eligible ? "Eligible" : "Not Eligible"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {subsidy.description}
                    </p>
                    <div className="flex items-center space-x-1 text-sm font-medium text-secondary">
                      <IndianRupee className="w-3 h-3" />
                      <span data-testid={`subsidy-amount-${index}`}>
                        {subsidy.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
                
                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Total Eligible Subsidies</span>
                    <span className="text-primary" data-testid="total-subsidies">
                      ₹{subsidies.filter(s => s.eligible).reduce((sum, s) => sum + s.amount, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>AI Financial Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium text-foreground">
                    Cost Optimization
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Switch to organic fertilizers to reduce costs by 20%
                  </p>
                </div>
                <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                  <p className="text-sm font-medium text-foreground">
                    Market Timing
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Delay harvest by 1 week for 12% better prices
                  </p>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium text-foreground">
                    Diversification
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Consider intercropping to increase revenue by 25%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Analysis */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Financial Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <DollarSign className="w-8 h-8 text-destructive mx-auto mb-2" />
                <div className="text-2xl font-bold text-destructive" data-testid="summary-total-costs">
                  ₹{totalCosts.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Investment</div>
              </div>
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <IndianRupee className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary" data-testid="summary-total-revenue">
                  ₹{revenue.totalRevenue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Expected Revenue</div>
              </div>
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <TrendingUp className={`w-8 h-8 mx-auto mb-2 ${profit >= 0 ? "text-primary" : "text-destructive"}`} />
                <div className={`text-2xl font-bold ${profit >= 0 ? "text-primary" : "text-destructive"}`} data-testid="summary-net-profit">
                  ₹{profit.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Net Profit</div>
              </div>
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <Percent className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-accent" data-testid="summary-roi">
                  {roi.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Return on Investment</div>
              </div>
            </div>

            {profit > 0 && (
              <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h3 className="font-semibold text-foreground mb-2">
                  💡 Congratulations! Your farming plan looks profitable.
                </h3>
                <p className="text-sm text-muted-foreground">
                  Based on current market conditions and your inputs, this crop selection 
                  shows strong potential for profitability. Consider the AI recommendations 
                  above to further optimize your returns.
                </p>
              </div>
            )}

            {profit <= 0 && totalCosts > 0 && (
              <div className="mt-6 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <h3 className="font-semibold text-foreground mb-2">
                  ⚠️ Current plan shows potential losses.
                </h3>
                <p className="text-sm text-muted-foreground">
                  Consider revising your crop selection, reducing costs, or waiting for 
                  better market prices. Check the AI recommendations for optimization tips.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
