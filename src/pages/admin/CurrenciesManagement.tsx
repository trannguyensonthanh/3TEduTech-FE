import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CurrenciesTable, {
  Currency,
} from '@/components/admin/currencies/CurrenciesTable';
import CurrencyDialog from '@/components/admin/currencies/CurrencyDialog';
import DeleteCurrencyDialog from '@/components/admin/currencies/DeleteCurrencyDialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useToast } from '@/components/ui/use-toast';

// Mock data for currencies
const mockCurrencies: Currency[] = [
  { id: 'USD', name: 'US Dollar', type: 'FIAT', decimalPlaces: 2 },
  { id: 'EUR', name: 'Euro', type: 'FIAT', decimalPlaces: 2 },
  { id: 'JPY', name: 'Japanese Yen', type: 'FIAT', decimalPlaces: 0 },
  { id: 'GBP', name: 'British Pound', type: 'FIAT', decimalPlaces: 2 },
  { id: 'AUD', name: 'Australian Dollar', type: 'FIAT', decimalPlaces: 2 },
  { id: 'CAD', name: 'Canadian Dollar', type: 'FIAT', decimalPlaces: 2 },
  { id: 'CHF', name: 'Swiss Franc', type: 'FIAT', decimalPlaces: 2 },
  { id: 'CNY', name: 'Chinese Yuan', type: 'FIAT', decimalPlaces: 2 },
  { id: 'VND', name: 'Vietnamese Dong', type: 'FIAT', decimalPlaces: 0 },
  { id: 'BTC', name: 'Bitcoin', type: 'CRYPTO', decimalPlaces: 8 },
  { id: 'ETH', name: 'Ethereum', type: 'CRYPTO', decimalPlaces: 18 },
  { id: 'USDT', name: 'Tether', type: 'CRYPTO', decimalPlaces: 6 },
];

const CurrenciesManagement = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    null
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currencyToDelete, setCurrencyToDelete] = useState<Currency | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const itemsPerPage = 10;

  useEffect(() => {
    // In a real app, fetch currencies from API
    // For now, using mock data
    const fetchCurrencies = async () => {
      try {
        setIsLoading(true);
        // Simulating API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setCurrencies(mockCurrencies);
        setTotalPages(Math.ceil(mockCurrencies.length / itemsPerPage));
      } catch (error) {
        console.error('Error fetching currencies:', error);
        toast({
          title: 'Error',
          description: 'Failed to load currencies. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrencies();
  }, [toast]);

  const handleAddCurrency = (data: {
    id: string;
    name: string;
    type: 'FIAT' | 'CRYPTO';
    decimalPlaces: number;
  }) => {
    // Check if currency ID already exists
    if (currencies.some((currency) => currency.id === data.id)) {
      toast({
        title: 'Error',
        description: `Currency with ID ${data.id} already exists.`,
        variant: 'destructive',
      });
      return;
    }

    // In a real app, make API call to add currency
    const newCurrency: Currency = {
      id: data.id,
      name: data.name,
      type: data.type,
      decimalPlaces: data.decimalPlaces,
    };

    setCurrencies([...currencies, newCurrency]);
    toast({
      title: 'Success',
      description: 'Currency added successfully.',
    });
  };

  const handleEditCurrency = (currency: Currency) => {
    setSelectedCurrency(currency);
    setIsAddDialogOpen(true);
  };

  const handleUpdateCurrency = (data: {
    id: string;
    name: string;
    type: 'FIAT' | 'CRYPTO';
    decimalPlaces: number;
  }) => {
    if (!selectedCurrency) return;

    // In a real app, make API call to update currency
    const updatedCurrencies = currencies.map((currency) =>
      currency.id === selectedCurrency.id
        ? {
            ...currency,
            name: data.name,
            type: data.type,
            decimalPlaces: data.decimalPlaces,
          }
        : currency
    );

    setCurrencies(updatedCurrencies);
    setSelectedCurrency(null);
    toast({
      title: 'Success',
      description: 'Currency updated successfully.',
    });
  };

  const handleDeleteClick = (currency: Currency) => {
    setCurrencyToDelete(currency);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCurrency = () => {
    if (!currencyToDelete) return;

    // In a real app, make API call to delete currency
    const updatedCurrencies = currencies.filter(
      (currency) => currency.id !== currencyToDelete.id
    );
    setCurrencies(updatedCurrencies);
    setCurrencyToDelete(null);
    setIsDeleteDialogOpen(false);
    toast({
      title: 'Success',
      description: 'Currency deleted successfully.',
    });
  };

  // Calculate pagination
  const paginatedCurrencies = currencies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Currencies Management
          </h1>
          <Button
            onClick={() => {
              setSelectedCurrency(null);
              setIsAddDialogOpen(true);
            }}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Currency
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Supported Currencies</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-10 text-center text-muted-foreground">
                Loading currencies...
              </div>
            ) : (
              <>
                <CurrenciesTable
                  currencies={paginatedCurrencies}
                  onEdit={handleEditCurrency}
                  onDelete={handleDeleteClick}
                />
                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            className={
                              currentPage === 1
                                ? 'pointer-events-none opacity-50'
                                : 'cursor-pointer'
                            }
                          />
                        </PaginationItem>

                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              isActive={currentPage === page}
                              onClick={() => setCurrentPage(page)}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              setCurrentPage((p) => Math.min(totalPages, p + 1))
                            }
                            className={
                              currentPage === totalPages
                                ? 'pointer-events-none opacity-50'
                                : 'cursor-pointer'
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <CurrencyDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        currency={selectedCurrency}
        onSubmit={selectedCurrency ? handleUpdateCurrency : handleAddCurrency}
        isEditing={!!selectedCurrency}
      />

      <DeleteCurrencyDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteCurrency}
        currencyName={currencyToDelete?.name || ''}
        currencyId={currencyToDelete?.id || ''}
      />
    </AdminLayout>
  );
};

export default CurrenciesManagement;
