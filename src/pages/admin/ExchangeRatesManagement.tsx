import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ExchangeRatesTable, {
  ExchangeRate,
} from '@/components/admin/exchange-rates/ExchangeRatesTable';
import ExchangeRateDialog from '@/components/admin/exchange-rates/ExchangeRateDialog';
import DeleteExchangeRateDialog from '@/components/admin/exchange-rates/DeleteExchangeRateDialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useToast } from '@/components/ui/use-toast';
import { Currency } from '@/components/admin/currencies/CurrenciesTable';

// Mock data for currencies (should be fetched in a real app)
const mockCurrencies: Currency[] = [
  { id: 'USD', name: 'US Dollar', type: 'FIAT', decimalPlaces: 2 },
  { id: 'EUR', name: 'Euro', type: 'FIAT', decimalPlaces: 2 },
  { id: 'JPY', name: 'Japanese Yen', type: 'FIAT', decimalPlaces: 0 },
  { id: 'GBP', name: 'British Pound', type: 'FIAT', decimalPlaces: 2 },
  { id: 'VND', name: 'Vietnamese Dong', type: 'FIAT', decimalPlaces: 0 },
  { id: 'BTC', name: 'Bitcoin', type: 'CRYPTO', decimalPlaces: 8 },
  { id: 'ETH', name: 'Ethereum', type: 'CRYPTO', decimalPlaces: 18 },
  { id: 'USDT', name: 'Tether', type: 'CRYPTO', decimalPlaces: 6 },
];

// Mock data for exchange rates
const mockExchangeRates: ExchangeRate[] = [
  {
    id: 1,
    fromCurrencyId: 'USD',
    toCurrencyId: 'VND',
    rate: 24565,
    effectiveTimestamp: '2023-05-01T00:00:00Z',
    source: 'Yahoo Finance',
  },
  {
    id: 2,
    fromCurrencyId: 'EUR',
    toCurrencyId: 'USD',
    rate: 1.08,
    effectiveTimestamp: '2023-05-01T00:00:00Z',
    source: 'Yahoo Finance',
  },
  {
    id: 3,
    fromCurrencyId: 'BTC',
    toCurrencyId: 'USD',
    rate: 61254.89,
    effectiveTimestamp: '2023-05-01T00:00:00Z',
    source: 'CoinMarketCap',
  },
  {
    id: 4,
    fromCurrencyId: 'ETH',
    toCurrencyId: 'USD',
    rate: 3028.45,
    effectiveTimestamp: '2023-05-01T00:00:00Z',
    source: 'CoinMarketCap',
  },
  {
    id: 5,
    fromCurrencyId: 'USDT',
    toCurrencyId: 'USD',
    rate: 0.9998,
    effectiveTimestamp: '2023-05-01T00:00:00Z',
    source: 'CoinMarketCap',
  },
  {
    id: 6,
    fromCurrencyId: 'VND',
    toCurrencyId: 'USD',
    rate: 0.000040747,
    effectiveTimestamp: '2023-05-01T00:00:00Z',
    source: 'Yahoo Finance',
  },
  {
    id: 7,
    fromCurrencyId: 'USD',
    toCurrencyId: 'EUR',
    rate: 0.9259,
    effectiveTimestamp: '2023-05-01T00:00:00Z',
    source: 'Yahoo Finance',
  },
  {
    id: 8,
    fromCurrencyId: 'USD',
    toCurrencyId: 'JPY',
    rate: 151.59,
    effectiveTimestamp: '2023-05-01T00:00:00Z',
    source: 'Yahoo Finance',
  },
  {
    id: 9,
    fromCurrencyId: 'USD',
    toCurrencyId: 'GBP',
    rate: 0.7893,
    effectiveTimestamp: '2023-05-01T00:00:00Z',
    source: 'Yahoo Finance',
  },
  {
    id: 10,
    fromCurrencyId: 'BTC',
    toCurrencyId: 'ETH',
    rate: 20.23,
    effectiveTimestamp: '2023-05-01T00:00:00Z',
    source: 'CoinMarketCap',
  },
];

const ExchangeRatesManagement = () => {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedRate, setSelectedRate] = useState<ExchangeRate | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rateToDelete, setRateToDelete] = useState<ExchangeRate | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const itemsPerPage = 10;

  useEffect(() => {
    // In a real app, fetch exchange rates and currencies from API
    // For now, using mock data
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Simulating API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Load currencies first (needed for the dropdown in the dialog)
        setCurrencies(mockCurrencies);

        // Then load exchange rates
        setExchangeRates(mockExchangeRates);
        setTotalPages(Math.ceil(mockExchangeRates.length / itemsPerPage));
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleAddExchangeRate = (data: Omit<ExchangeRate, 'id'>) => {
    // Check if exchange rate already exists for the same currency pair
    if (
      exchangeRates.some(
        (rate) =>
          rate.fromCurrencyId === data.fromCurrencyId &&
          rate.toCurrencyId === data.toCurrencyId &&
          new Date(rate.effectiveTimestamp).getTime() ===
            new Date(data.effectiveTimestamp).getTime()
      )
    ) {
      toast({
        title: 'Error',
        description: `Exchange rate already exists for ${data.fromCurrencyId} to ${data.toCurrencyId} at the specified time.`,
        variant: 'destructive',
      });
      return;
    }

    // In a real app, make API call to add exchange rate
    const newRate: ExchangeRate = {
      id: Math.max(0, ...exchangeRates.map((rate) => rate.id)) + 1,
      ...data,
    };

    setExchangeRates([...exchangeRates, newRate]);
    toast({
      title: 'Success',
      description: 'Exchange rate added successfully.',
    });
  };

  const handleEditRate = (rate: ExchangeRate) => {
    setSelectedRate(rate);
    setIsAddDialogOpen(true);
  };

  const handleUpdateRate = (data: Omit<ExchangeRate, 'id'>) => {
    if (!selectedRate) return;

    // In a real app, make API call to update exchange rate
    const updatedRates = exchangeRates.map((rate) =>
      rate.id === selectedRate.id
        ? {
            ...rate,
            rate: data.rate,
            effectiveTimestamp: data.effectiveTimestamp,
            source: data.source,
          }
        : rate
    );

    setExchangeRates(updatedRates);
    setSelectedRate(null);
    toast({
      title: 'Success',
      description: 'Exchange rate updated successfully.',
    });
  };

  const handleDeleteClick = (rate: ExchangeRate) => {
    setRateToDelete(rate);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteRate = () => {
    if (!rateToDelete) return;

    // In a real app, make API call to delete exchange rate
    const updatedRates = exchangeRates.filter(
      (rate) => rate.id !== rateToDelete.id
    );
    setExchangeRates(updatedRates);
    setRateToDelete(null);
    setIsDeleteDialogOpen(false);
    toast({
      title: 'Success',
      description: 'Exchange rate deleted successfully.',
    });
  };

  // Calculate pagination
  const paginatedRates = exchangeRates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Exchange Rates Management
          </h1>
          <Button
            onClick={() => {
              setSelectedRate(null);
              setIsAddDialogOpen(true);
            }}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Rate
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Exchange Rates</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-10 text-center text-muted-foreground">
                Loading exchange rates...
              </div>
            ) : (
              <>
                <ExchangeRatesTable
                  exchangeRates={paginatedRates}
                  onEdit={handleEditRate}
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

      <ExchangeRateDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        exchangeRate={selectedRate}
        onSubmit={selectedRate ? handleUpdateRate : handleAddExchangeRate}
        isEditing={!!selectedRate}
        currencies={currencies}
      />

      <DeleteExchangeRateDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteRate}
        fromCurrency={rateToDelete?.fromCurrencyId || ''}
        toCurrency={rateToDelete?.toCurrencyId || ''}
      />
    </AdminLayout>
  );
};

export default ExchangeRatesManagement;
