#include <iostream>
#include <vector>
#include <string>
#include <memory>

// Subscriber Interface
class IObserver {
public:
    virtual void update(float temperature) = 0;
    virtual ~IObserver() = default;
};

// Publisher
class WeatherStation {
private:
    std::vector<IObserver*> observers;
    float temperature = 0.0f;

public:
    void addObserver(IObserver* observer) {
        observers.push_back(observer);
    }

    void removeObserver(IObserver* observer) {
        observers.erase(
            std::remove(observers.begin(), observers.end(), observer),
            observers.end()
        );
    }

    void setTemperature(float temp) {
        temperature = temp;
        notifyObservers();
    }

    void notifyObservers() {
        for (auto* obs : observers) {
            obs->update(temperature);
        }
    }
};

// Concrete Observer 1
class PhoneDisplay : public IObserver {
public:
    void update(float temperature) override {
        std::cout << "[Phone Display] Temperature updated: " 
            << temperature << "C\n";
    }
};

// Concrete Observer 2
class LEDDisplay : public IObserver {
public:
    void update(float temperature) override {
        std::cout << "[LED Display] Temperature updated: " 
            << temperature << "C\n";
    }
};

int main() {
    WeatherStation station;

    PhoneDisplay phone;
    LEDDisplay led;

    station.addObserver(&phone);
    station.addObserver(&led);

    station.setTemperature(25.3f);
    std::cout << "\n";

    station.setTemperature(26.7f);
    std::cout << "\n";

    station.removeObserver(&led);
    station.setTemperature(28.1f);

    return 0;
}