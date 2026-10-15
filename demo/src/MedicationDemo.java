import java.util.Objects;

// Alle Werte sind frei erfunden und keine medizinische Beratung.
class MedicationDemo {
    enum Drug { PARACETAMOL, CAFFEINE, IBUPROFEN }

    sealed interface Dosage permits Tablet, Infusion, Injection {}

    value record Tablet(int morning, int midday, int evening) implements Dosage {
        Tablet {
            if (morning < 0 || midday < 0 || evening < 0) {
                throw new IllegalArgumentException("negative number of tablets");
            }
        }
    }

    value record Infusion(int speed, int duration) implements Dosage {}

    value record Injection() implements Dosage {}

    value record Medication(Drug drug, Dosage dosage) {
        Medication {
            Objects.requireNonNull(drug);
            Objects.requireNonNull(dosage);
        }
    }

    String formatDosage(Dosage dosage) {
        return switch (dosage) {
            case null -> "no dosage";
            case Tablet(int morning, int midday, int evening) ->
                    "%d-%d-%d".formatted(morning, midday, evening);
            case Infusion(int speed, int duration) ->
                    "%d ml/h for %d h".formatted(speed, duration);
            case Injection _ -> "injection";
        };
    }

    String describe(Medication medication) {
        return switch (medication) {
            case null -> "no medication";
            case Medication(var drug, Tablet(int morning, int midday, int evening))
                    when (long) morning + midday + evening > 6 ->
                    drug + ": " + formatDosage(medication.dosage()) + " (many tablets)";
            case Medication(var drug, Infusion(_, int duration)) when duration > 8 ->
                    drug + ": " + formatDosage(medication.dosage()) + " (long-running infusion)";
            case Medication(var drug, Dosage dosage) ->
                    drug + ": " + formatDosage(dosage);
        };
    }
}
