import java.math.BigDecimal;
import java.util.Currency;
import java.util.Objects;
import java.util.WeakHashMap;

void main() {
    var eur = Currency.getInstance("EUR");
    var price = new MonetaryAmount(1250, eur);
    var shipping = new MonetaryAmount(490, eur);
    var total = price.plus(shipping);

    IO.println("Preis: " + price.formatted());
    IO.println("Versand: " + shipping.formatted());
    IO.println("Summe (normale Methode plus): " + total.formatted());

    Amount amount = total;
    IO.println("Geerbte Methode ueber abstrakte Value Class: " + amount.formatted());
    IO.println("MonetaryAmount.class.isValue(): " + MonetaryAmount.class.isValue());
    IO.println("Objects.hasIdentity(total): " + Objects.hasIdentity(total));

    // synchronized (total) {} // Compilerfehler: statisch bekannter Value-Typ.
    Object monitor = total;
    try {
        synchronized (monitor) {
            IO.println("Dieser Block darf nicht erreicht werden.");
        }
    } catch (IdentityException exception) {
        IO.println("synchronized ueber Object abgelehnt: " + exception);
    }

    var cache = new WeakHashMap<MonetaryAmount, String>();
    try {
        cache.put(total, "Rechnungsbetrag");
    } catch (IdentityException exception) {
        IO.println("Value Object als WeakHashMap-Schluessel abgelehnt: " + exception);
    }
}

abstract value class Amount {
    abstract long cents();

    abstract Currency currency();

    String formatted() {
        return BigDecimal.valueOf(cents(), 2) + " " + currency().getCurrencyCode();
    }
}

final value class MonetaryAmount extends Amount {
    private final long cents;
    private final Currency currency;

    MonetaryAmount(long cents, Currency currency) {
        this.cents = cents;
        this.currency = Objects.requireNonNull(currency);
    }

    @Override
    long cents() {
        return cents;
    }

    @Override
    Currency currency() {
        return currency;
    }

    MonetaryAmount plus(MonetaryAmount other) {
        if (!currency.equals(other.currency)) {
            throw new IllegalArgumentException("Unterschiedliche Waehrungen");
        }
        return new MonetaryAmount(Math.addExact(cents, other.cents), currency);
    }
}
