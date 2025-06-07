namespace Observer2
{
    // Subscriber interface
    public interface IInvestor
    {
        void Update(Stock stock);
    }

    // Subject (Publisher)
    public class Stock
    {
        private readonly List<IInvestor> _investors = new();
        private decimal _price;

        public string Symbol { get; }

        public decimal Price
        {
            get => _price;
            set
            {
                if (_price != value)
                {
                    _price = value;
                    Notify();
                }
            }
        }

        public Stock(string symbol, decimal initialPrice)
        {
            Symbol = symbol;
            _price = initialPrice;
        }

        public void Attach(IInvestor investor)
        {
            _investors.Add(investor);
        }

        public void Detach(IInvestor investor)
        {
            _investors.Remove(investor);
        }

        private void Notify()
        {
            foreach (var investor in _investors)
            {
                investor.Update(this);
            }
        }
    }

    // Concrete Observer
    public class Investor : IInvestor
    {
        private readonly string _name;

        public Investor(string name)
        {
            _name = name;
        }

        public void Update(Stock stock)
        {
            Console.WriteLine($"[{_name}] Notified: " +
                $"{stock.Symbol} is now {stock.Price:C}");
            // Additional logic: buy/sell/etc.
        }
    }

    // Client code
    public class Program
    {
        public static void Main()
        {
            Stock apple = new Stock("AAPL", 150.00m);

            Investor alice = new Investor("Alice");
            Investor bob = new Investor("Bob");

            apple.Attach(alice);
            apple.Attach(bob);

            apple.Price = 151.25m;
            Console.WriteLine();
            apple.Price = 153.00m;
            Console.WriteLine();

            apple.Detach(bob);
            apple.Price = 149.50m;
        }
    }
}
