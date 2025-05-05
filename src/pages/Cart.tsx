import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/common/Icons";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const Cart = () => {
  const { items, removeItem, clearCart, total } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [discount, setDiscount] = useState(0);

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a promo code",
      });
      return;
    }

    setIsApplyingPromo(true);

    // Mock promo code check
    setTimeout(() => {
      if (promoCode.toLowerCase() === "newuser20") {
        const discountAmount = total * 0.2;
        setDiscount(discountAmount);
        toast({
          title: "Promo code applied",
          description: "20% discount has been applied to your order",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid promo code",
          description: "The promo code you entered is invalid or expired",
        });
      }
      setIsApplyingPromo(false);
    }, 1000);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Cart is empty",
        description: "Please add courses to your cart before checkout",
      });
      return;
    }

    navigate("/checkout");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16 space-y-6">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <Icons.shoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Looks like you haven't added any courses to your cart yet. Browse
              our courses and find something that interests you.
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {items.length} Course{items.length !== 1 ? "s" : ""}
                </h2>
                <Button variant="ghost" size="sm" onClick={clearCart}>
                  <Icons.trash className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4 bg-card"
                  >
                    <div className="sm:w-1/4">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full aspect-video object-cover rounded-md"
                      />
                    </div>

                    <div className="sm:w-3/4 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between">
                          <Link
                            to={`/courses/${item.slug}`}
                            className="text-lg font-semibold hover:text-brand-600 transition-colors"
                          >
                            {item.title}
                          </Link>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8"
                          >
                            <Icons.x className="h-4 w-4" />
                          </Button>
                        </div>

                        <p className="text-muted-foreground text-sm">
                          By {item.instructor}
                        </p>
                      </div>

                      <div className="mt-2">
                        {item.discountedPrice ? (
                          <div className="flex items-baseline space-x-2">
                            <span className="text-lg font-bold">
                              ${item.discountedPrice.toFixed(2)}
                            </span>
                            <span className="text-muted-foreground line-through text-sm">
                              ${item.price.toFixed(2)}
                            </span>
                            <Badge variant="destructive" className="ml-2">
                              {Math.round(
                                (1 - item.discountedPrice / item.price) * 100
                              )}
                              % OFF
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-lg font-bold">
                            ${item.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="border rounded-lg p-6 bg-card sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Original Price:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${(total - discount).toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyPromo}
                      disabled={isApplyingPromo}
                    >
                      {isApplyingPromo ? (
                        <>
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          Applying...
                        </>
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>

                  <Button className="w-full" size="lg" onClick={handleCheckout}>
                    Checkout
                  </Button>

                  <Button asChild variant="ghost" className="w-full">
                    <Link to="/courses">Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
