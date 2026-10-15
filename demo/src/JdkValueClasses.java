import java.time.Duration;
import java.time.LocalDate;
import java.util.Objects;
import java.util.Optional;

class JdkValueClasses {
    void main() {
        Integer quantity = 3;
        Double unitPrice = 12.50;
        IO.println("Wrapper: " + quantity + " * " + unitPrice + " = " + quantity * unitPrice);
        showValue("Integer", quantity);
        showValue("Double", unitPrice);

        var today = LocalDate.of(2026, 10, 15);
        var nextWeek = today.plusWeeks(1);
        IO.println("LocalDate: " + today + " -> " + nextWeek);
        showValue("LocalDate", nextWeek);

        var talk = Duration.ofMinutes(45);
        IO.println("Duration mit Fragen: " + talk.plusMinutes(15).toMinutes() + " Minuten");
        showValue("Duration", talk);

        var title = Optional.of("Valhalla Now");
        IO.println("Optional.map: " + title.map(String::toUpperCase).orElse("Kein Titel"));
        showValue("Optional", title);

        var lock = Objects.requireIdentity(new Object());
        IO.println("Lock hat Identitaet: " + Objects.hasIdentity(lock));
        try {
            Objects.requireIdentity(quantity);
        } catch (IdentityException exception) {
            IO.println("Integer als Lock abgelehnt: " + exception);
        }
    }

    void showValue(String name, Object value) {
        IO.println("  " + name + ": Class.isValue() = " + value.getClass().isValue()
                + ", Objects.hasIdentity() = " + Objects.hasIdentity(value));
    }
}
