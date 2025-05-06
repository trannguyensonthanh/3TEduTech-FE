import React from 'react';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface PricingTabProps {
  form: UseFormReturn<{
    courseName?: string;
    slug?: string;
    shortDescription?: string;
    fullDescription?: string;
    originalPrice?: number;
    discountedPrice?: number;
    categoryId?: number;
    levelId?: number;
    language?: string;
    requirements?: string;
    learningOutcomes?: string;
  }>;
}
const PricingTab: React.FC<PricingTabProps> = ({ form }) => {
  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Course Pricing</CardTitle>
              <CardDescription>
                Set the right price for your course to maximize earnings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Regular Price ($)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="e.g. 49.99"
                          className="pl-8"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Set a fair price that reflects the value of your course.
                    </FormDescription>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountedPrice"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Discounted Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-8"
                          type="number"
                          placeholder="Enter discounted price (optional)"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Provide a discounted price to attract more students. This
                      is optional.
                    </FormDescription>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              {/* 
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enablePromotion"
                  className="rounded border-gray-300"
                />
                <label htmlFor="enablePromotion" className="text-sm">
                  Enable promotional price
                </label>
              </div> */}
            </CardContent>
          </Card>

          {/* Revenue Projection */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Projection</CardTitle>
              <CardDescription>
                Estimated earnings based on your chosen price
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Your Price
                    </span>
                    <span className="font-medium">
                      $
                      {parseFloat(
                        String(
                          form.watch('discountedPrice') ||
                            form.watch('originalPrice') ||
                            '0'
                        )
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Platform Fee (30%)
                    </span>
                    <span className="font-medium">
                      -$
                      {(
                        parseFloat(
                          String(
                            form.watch('discountedPrice') ||
                              form.watch('originalPrice') ||
                              '0'
                          )
                        ) * 0.3
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Transaction Fee (3%)
                    </span>
                    <span className="font-medium">
                      -$
                      {(
                        parseFloat(
                          String(
                            form.watch('discountedPrice') ||
                              form.watch('originalPrice') ||
                              '0'
                          )
                        ) * 0.03
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between">
                      <span className="font-medium">Your Revenue</span>
                      <span className="font-medium">
                        $
                        {(
                          parseFloat(
                            String(
                              form.watch('discountedPrice') ||
                                form.watch('originalPrice') ||
                                '0'
                            )
                          ) * 0.67
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>
                  This is an estimate. Actual earnings may vary based on
                  promotions, country-specific taxes, and other factors.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
};

export default PricingTab;
