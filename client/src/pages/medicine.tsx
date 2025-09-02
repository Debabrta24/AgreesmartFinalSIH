import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Plus, Minus, Filter, Search, MapPin, Truck } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand?: string;
  imageUrl?: string;
  inStock: boolean;
  stockQuantity?: number;
  pestTargets?: string[];
  activeIngredients?: string[];
  usage?: string;
}

interface CartItem {
  id: string;
  userId: string;
  medicineId: string;
  quantity: number;
}

export default function Medicine() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    pincode: "",
    city: "",
    district: "",
    state: ""
  });

  // Fetch medicines
  const { data: medicines = [], isLoading: medicinesLoading } = useQuery({
    queryKey: ["/api/medicines"],
    queryFn: () => fetch("/api/medicines").then(res => res.json())
  });

  // Fetch cart items
  const { data: cartItems = [], isLoading: cartLoading } = useQuery({
    queryKey: ["/api/cart"],
    queryFn: () => fetch("/api/cart").then(res => res.json())
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: (data: { medicineId: string; quantity: number }) => 
      apiRequest("POST", "/api/cart/add", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: t("medicine.addedToCart"),
        description: t("medicine.cartUpdated")
      });
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: t("medicine.cartError"),
        variant: "destructive"
      });
    }
  });

  // Update cart mutation
  const updateCartMutation = useMutation({
    mutationFn: (data: { id: string; quantity: number }) => 
      apiRequest("PUT", `/api/cart/${data.id}`, { quantity: data.quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    }
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/cart/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    }
  });

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: (orderData: any) => apiRequest("POST", "/api/orders", orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      setCheckoutOpen(false);
      setDeliveryForm({
        fullName: "",
        phone: "",
        address: "",
        pincode: "",
        city: "",
        district: "",
        state: ""
      });
      toast({
        title: t("medicine.orderPlaced"),
        description: t("medicine.orderSuccess")
      });
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: t("medicine.orderError"),
        variant: "destructive"
      });
    }
  });

  // Filter medicines
  const filteredMedicines = medicines.filter((medicine: Medicine) => {
    const matchesCategory = selectedCategory === "all" || medicine.category === selectedCategory;
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (medicine.pestTargets && medicine.pestTargets.some(target => 
                           target.toLowerCase().includes(searchTerm.toLowerCase())
                         ));
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (medicineId: string) => {
    addToCartMutation.mutate({ medicineId, quantity: 1 });
  };

  const handleUpdateCart = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCartMutation.mutate(id);
    } else {
      updateCartMutation.mutate({ id, quantity });
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total: number, item: CartItem & { medicine: Medicine }) => 
      total + (item.medicine?.price * item.quantity || 0), 0
    );
  };

  const getCartQuantity = (medicineId: string) => {
    const cartItem = cartItems.find((item: CartItem) => item.medicineId === medicineId);
    return cartItem?.quantity || 0;
  };

  const handlePlaceOrder = () => {
    if (!deliveryForm.fullName || !deliveryForm.phone || !deliveryForm.address || !deliveryForm.pincode || !deliveryForm.city) {
      toast({
        title: t("medicine.incompleteForm"),
        description: t("medicine.fillAllFields"),
        variant: "destructive"
      });
      return;
    }

    const orderData = {
      totalAmount: getTotalPrice(),
      deliveryAddress: `${deliveryForm.fullName}, ${deliveryForm.address}, ${deliveryForm.city}, ${deliveryForm.district}, ${deliveryForm.state} - ${deliveryForm.pincode}. Phone: ${deliveryForm.phone}`
    };

    placeOrderMutation.mutate(orderData);
  };

  // Indian states and cities data
  const indianStates = [
    "Andhra Pradesh", "Assam", "Bihar", "Gujarat", "Haryana", "Himachal Pradesh",
    "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", 
    "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"
  ];

  const getCitiesByState = (state: string) => {
    const citiesData: Record<string, string[]> = {
      "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur"],
      "Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Mangaluru", "Belagavi", "Gulbarga"],
      "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli"],
      "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"],
      "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Allahabad"],
      "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Malda"],
      "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer"],
      "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali"],
      "Haryana": ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar", "Rohtak"],
      "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga"]
    };
    return citiesData[state] || [];
  };

  const categories = [
    { value: "all", label: t("medicine.allCategories") },
    { value: "organic", label: t("medicine.organic") },
    { value: "chemical", label: t("medicine.chemical") },
    { value: "ayurvedic", label: t("medicine.ayurvedic") }
  ];

  if (medicinesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">{t("common.loading")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground mb-2" data-testid="page-title">
            {t("medicine.title")}
          </h1>
          <p className="text-muted-foreground">{t("medicine.description")}</p>
        </div>
        
        {/* Cart Button */}
        <Button 
          onClick={() => setCartOpen(!cartOpen)} 
          className="relative"
          data-testid="cart-button"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {t("medicine.cart")} ({cartItems.length})
          {cartItems.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground min-w-[1.2rem] h-5 flex items-center justify-center text-xs">
              {cartItems.reduce((total: number, item: CartItem) => total + item.quantity, 0)}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t("medicine.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="search-input"
            />
          </div>
        </div>
        <div className="sm:w-48">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger data-testid="category-filter">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Medicine Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMedicines.map((medicine: Medicine) => (
              <Card key={medicine.id} className="hover:shadow-lg transition-shadow" data-testid={`medicine-card-${medicine.id}`}>
                <CardHeader className="p-4">
                  {medicine.imageUrl && (
                    <img 
                      src={medicine.imageUrl} 
                      alt={medicine.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      data-testid={`medicine-image-${medicine.id}`}
                    />
                  )}
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{medicine.name}</CardTitle>
                    <Badge variant={medicine.category === "organic" ? "secondary" : 
                                  medicine.category === "ayurvedic" ? "outline" : "default"}>
                      {t(`medicine.${medicine.category}`)}
                    </Badge>
                  </div>
                  {medicine.brand && (
                    <p className="text-sm text-muted-foreground">{medicine.brand}</p>
                  )}
                </CardHeader>
                
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {medicine.description}
                  </p>
                  
                  {medicine.pestTargets && (
                    <div className="mb-4">
                      <p className="text-xs font-medium mb-2">{t("medicine.effectiveAgainst")}:</p>
                      <div className="flex flex-wrap gap-1">
                        {medicine.pestTargets.slice(0, 3).map((pest, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {pest}
                          </Badge>
                        ))}
                        {medicine.pestTargets.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{medicine.pestTargets.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">₹{medicine.price}</p>
                      <p className="text-xs text-muted-foreground">
                        {medicine.inStock 
                          ? `${t("medicine.inStock")} (${medicine.stockQuantity})`
                          : t("medicine.outOfStock")
                        }
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getCartQuantity(medicine.id) > 0 ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const cartItem = cartItems.find((item: CartItem) => item.medicineId === medicine.id);
                              if (cartItem) {
                                handleUpdateCart(cartItem.id, cartItem.quantity - 1);
                              }
                            }}
                            data-testid={`decrease-quantity-${medicine.id}`}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="min-w-[2rem] text-center">{getCartQuantity(medicine.id)}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const cartItem = cartItems.find((item: CartItem) => item.medicineId === medicine.id);
                              if (cartItem) {
                                handleUpdateCart(cartItem.id, cartItem.quantity + 1);
                              }
                            }}
                            data-testid={`increase-quantity-${medicine.id}`}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleAddToCart(medicine.id)}
                          disabled={!medicine.inStock || addToCartMutation.isPending}
                          size="sm"
                          data-testid={`add-to-cart-${medicine.id}`}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          {t("medicine.addToCart")}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredMedicines.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("medicine.noResults")}</p>
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        {cartOpen && (
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  {t("medicine.cart")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cartItems.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    {t("medicine.emptyCart")}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item: CartItem & { medicine: Medicine }) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg" data-testid={`cart-item-${item.id}`}>
                        {item.medicine?.imageUrl && (
                          <img 
                            src={item.medicine.imageUrl} 
                            alt={item.medicine.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.medicine?.name}</p>
                          <p className="text-xs text-muted-foreground">₹{item.medicine?.price} each</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0"
                              onClick={() => handleUpdateCart(item.id, item.quantity - 1)}
                              data-testid={`cart-decrease-${item.id}`}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-sm min-w-[1.5rem] text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0"
                              onClick={() => handleUpdateCart(item.id, item.quantity + 1)}
                              data-testid={`cart-increase-${item.id}`}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">₹{(item.medicine?.price * item.quantity) || 0}</p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold">{t("medicine.total")}:</span>
                        <span className="font-bold text-lg">₹{getTotalPrice()}</span>
                      </div>
                      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full" data-testid="checkout-button">
                            <Truck className="w-4 h-4 mr-2" />
                            {t("medicine.checkout")}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <MapPin className="w-5 h-5" />
                              {t("medicine.deliveryDetails")}
                            </DialogTitle>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            {/* Order Summary */}
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-2">{t("medicine.orderSummary")}</h4>
                              <div className="space-y-1 text-sm">
                                {cartItems.map((item: CartItem & { medicine: Medicine }) => (
                                  <div key={item.id} className="flex justify-between">
                                    <span>{item.medicine?.name} x{item.quantity}</span>
                                    <span>₹{(item.medicine?.price * item.quantity) || 0}</span>
                                  </div>
                                ))}
                                <div className="border-t pt-1 font-semibold flex justify-between">
                                  <span>{t("medicine.total")}:</span>
                                  <span>₹{getTotalPrice()}</span>
                                </div>
                              </div>
                            </div>

                            {/* Delivery Form */}
                            <div className="grid grid-cols-1 gap-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="fullName">{t("medicine.fullName")} *</Label>
                                  <Input
                                    id="fullName"
                                    value={deliveryForm.fullName}
                                    onChange={(e) => setDeliveryForm({...deliveryForm, fullName: e.target.value})}
                                    placeholder={t("medicine.enterFullName")}
                                    data-testid="input-fullname"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="phone">{t("medicine.phone")} *</Label>
                                  <Input
                                    id="phone"
                                    value={deliveryForm.phone}
                                    onChange={(e) => setDeliveryForm({...deliveryForm, phone: e.target.value})}
                                    placeholder={t("medicine.enterPhone")}
                                    data-testid="input-phone"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <Label htmlFor="address">{t("medicine.address")} *</Label>
                                <Textarea
                                  id="address"
                                  value={deliveryForm.address}
                                  onChange={(e) => setDeliveryForm({...deliveryForm, address: e.target.value})}
                                  placeholder={t("medicine.enterAddress")}
                                  rows={3}
                                  data-testid="input-address"
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="pincode">{t("medicine.pincode")} *</Label>
                                  <Input
                                    id="pincode"
                                    value={deliveryForm.pincode}
                                    onChange={(e) => setDeliveryForm({...deliveryForm, pincode: e.target.value})}
                                    placeholder={t("medicine.enterPincode")}
                                    maxLength={6}
                                    data-testid="input-pincode"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="state">{t("medicine.state")} *</Label>
                                  <Select 
                                    value={deliveryForm.state} 
                                    onValueChange={(value) => {
                                      setDeliveryForm({...deliveryForm, state: value, city: "", district: ""});
                                    }}
                                  >
                                    <SelectTrigger data-testid="select-state">
                                      <SelectValue placeholder={t("medicine.selectState")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {indianStates.map((state) => (
                                        <SelectItem key={state} value={state}>{state}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="city">{t("medicine.city")} *</Label>
                                  <Select 
                                    value={deliveryForm.city} 
                                    onValueChange={(value) => {
                                      setDeliveryForm({...deliveryForm, city: value, district: value});
                                    }}
                                    disabled={!deliveryForm.state}
                                  >
                                    <SelectTrigger data-testid="select-city">
                                      <SelectValue placeholder={t("medicine.selectCity")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {getCitiesByState(deliveryForm.state).map((city) => (
                                        <SelectItem key={city} value={city}>{city}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="district">{t("medicine.district")}</Label>
                                  <Input
                                    id="district"
                                    value={deliveryForm.district}
                                    onChange={(e) => setDeliveryForm({...deliveryForm, district: e.target.value})}
                                    placeholder={t("medicine.enterDistrict")}
                                    data-testid="input-district"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-3 pt-4">
                              <Button 
                                variant="outline" 
                                onClick={() => setCheckoutOpen(false)} 
                                className="flex-1"
                                data-testid="button-cancel-order"
                              >
                                {t("common.cancel")}
                              </Button>
                              <Button 
                                onClick={handlePlaceOrder} 
                                disabled={placeOrderMutation.isPending}
                                className="flex-1"
                                data-testid="button-place-order"
                              >
                                {placeOrderMutation.isPending ? (
                                  t("medicine.placingOrder")
                                ) : (
                                  `${t("medicine.placeOrder")} (₹${getTotalPrice()})`
                                )}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}