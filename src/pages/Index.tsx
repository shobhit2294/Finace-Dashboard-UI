import { AppProvider } from '@/context/AppContext';
import Header from '@/components/dashboard/Header';
import SummaryCards from '@/components/dashboard/SummaryCards';
import BalanceTrend from '@/components/dashboard/BalanceTrend';
import SpendingBreakdown from '@/components/dashboard/SpendingBreakdown';
import TransactionsList from '@/components/dashboard/TransactionsList';
import Insights from '@/components/dashboard/Insights';

const Index = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <SummaryCards />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BalanceTrend />
            <SpendingBreakdown />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TransactionsList />
            </div>
            <Insights />
          </div>
        </main>
      </div>
    </AppProvider>
  );
};

export default Index;
