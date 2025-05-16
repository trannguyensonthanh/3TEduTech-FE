/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/layout/CartDropdown.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  Trash2,
  Loader2,
  ExternalLink,
  XCircle,
} from 'lucide-react';
import {
  useMyCart,
  useRemoveCourseFromCart,
} from '@/hooks/queries/cart.queries';
import { useToast } from '@/hooks/use-toast';

import { useAuth } from '@/contexts/AuthContext'; // Để kiểm tra đăng nhập
import { CartItem } from '@/services/cart.service';

const CartDropdown: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userData } = useAuth(); // Lấy user từ AuthContext

  // Fetch cart data, chỉ fetch khi user đã đăng nhập
  const {
    data: cartData,
    isLoading: isLoadingCart,
    isError,
    error,
  } = useMyCart({
    enabled: !!userData, // Chỉ fetch khi có user
  });

  const { mutate: removeItemMutate, isPending: isRemovingItem } =
    useRemoveCourseFromCart();

  const items = cartData?.items || [];
  const summary = cartData?.summary;
  const cartItemCount = items.length;

  const handleRemoveItem = (e: React.MouseEvent, courseId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRemovingItem) return;
    removeItemMutate(courseId, {
      onSuccess: (data) => {
        toast({ title: 'Item Removed', description: data.message });
      },
      onError: (error: any) => {
        toast({
          title: 'Error',
          description:
            error.response?.data?.message ||
            error.message ||
            'Could not remove item.',
          variant: 'destructive',
        });
      },
    });
  };

  const handleViewCart = () => {
    navigate('/cart');
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({ title: 'Cart is Empty', variant: 'destructive' });
      return;
    }
    navigate('/checkout', { state: { cartData } });
  };

  // --- Content cho Dropdown ---
  const DropdownCartContent = () => {
    if (!userData) {
      // Nếu chưa đăng nhập
      return (
        <div className="p-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Please log in to view your cart.
          </p>
          <Button
            size="sm"
            onClick={() =>
              navigate('/login', { state: { from: location.pathname } })
            }
          >
            Log In
          </Button>
        </div>
      );
    }

    if (isLoadingCart) {
      return (
        <div className="p-4 text-center flex flex-col items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground mt-2">Loading cart...</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="p-4 text-center text-destructive-foreground bg-destructive/90 rounded-b-md">
          <XCircle size={18} className="mx-auto mb-1" />
          <p className="text-xs">Error loading cart.</p>
          <p className="text-xxs">{error?.message}</p>
        </div>
      );
    }

    if (cartItemCount === 0) {
      return (
        <div className="p-6 text-center w-64 sm:w-72">
          <ShoppingCart className="h-10 w-10 mx-auto text-muted-foreground opacity-40 mb-3" />
          <p className="font-medium text-sm">Your cart is empty</p>
          <p className="text-xs text-muted-foreground mt-1 mb-3">
            Add courses to get started on your learning journey!
          </p>
          <Button size="sm" className="w-full" asChild>
            <Link to="/courses">Browse Courses</Link>
          </Button>
        </div>
      );
    }

    return (
      <>
        <DropdownMenuLabel className="px-3 py-2.5 text-sm font-semibold flex justify-between items-center">
          <span>Your Cart ({cartItemCount})</span>
          {/* <Button variant="ghost" size="xs" className="text-xs h-auto p-0 hover:bg-transparent text-muted-foreground hover:text-primary">View All</Button> */}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="max-h-[280px] md:max-h-[320px] lg:max-h-[360px] w-full">
          {' '}
          {/* Giới hạn chiều cao */}
          <div className="divide-y divide-border">
            {items.map((item: CartItem) => (
              <DropdownMenuItem
                key={item.cartItemId}
                className="p-0 focus:bg-transparent"
                asChild
              >
                <Link
                  to={`/courses/${item.slug}`}
                  className="flex items-start gap-3 p-2.5 hover:bg-muted/50 w-full"
                >
                  <div className="w-16 h-10 bg-muted rounded overflow-hidden shrink-0">
                    <img
                      src={
                        item.thumbnailUrl ||
                        `https://via.placeholder.com/160x90?text=${encodeURIComponent(
                          item.courseName.substring(0, 10)
                        )}`
                      }
                      alt={item.courseName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p
                      className="text-xs font-medium truncate leading-snug"
                      title={item.courseName}
                    >
                      {item.courseName}
                    </p>
                    <p className="text-xxs text-muted-foreground truncate">
                      By {item.instructorName}
                    </p>
                    <p className="text-xs font-semibold text-primary mt-0.5">
                      ${item.currentPrice.toFixed(2)}
                      {item.currentPrice < item.originalPrice && (
                        <span className="ml-1.5 text-xxs text-muted-foreground line-through">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 opacity-70 hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    onClick={(e) => handleRemoveItem(e, item.courseId)}
                    title="Remove from cart"
                  >
                    <Trash2 size={14} />
                  </Button>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        </ScrollArea>
        <DropdownMenuSeparator />
        <div className="p-3 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-semibold">
              ${(summary?.finalPrice || 0).toFixed(2)}
            </span>
          </div>
          <Button className="w-full h-9" size="sm" onClick={handleCheckout}>
            Go to Checkout
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full h-9"
            onClick={handleViewCart}
          >
            View Cart
          </Button>
        </div>
      </>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <ShoppingCart className="h-5 w-5" />
          {userData &&
            cartItemCount > 0 && ( // Chỉ hiển thị badge nếu đã đăng nhập và có item
              <Badge className="absolute -top-1.5 -right-1.5 h-5 min-w-[1.25rem] flex items-center justify-center p-0.5 text-xs rounded-full shadow-md">
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </Badge>
            )}
          {userData &&
            isLoadingCart &&
            !cartData && ( // Spinner nhỏ khi đang fetch lần đầu và chưa có data
              <Loader2 className="absolute -top-1.5 -right-1.5 h-5 w-5 p-0.5 text-primary animate-spin bg-background rounded-full" />
            )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 sm:w-80 md:w-96 p-0 shadow-xl"
        align="end"
        sideOffset={8}
      >
        {/* Render nội dung dropdown */}
        <DropdownCartContent />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CartDropdown;
