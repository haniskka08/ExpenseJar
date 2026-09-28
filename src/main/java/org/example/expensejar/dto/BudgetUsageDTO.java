package org.example.expensejar.dto;

public class BudgetUsageDTO {

    private String category;
    private double budget;
    private double spent;
    private double usagePercentage;

    public BudgetUsageDTO() {
    }

    public BudgetUsageDTO(String category, double budget, double spent, double usagePercentage) {
        this.category = category;
        this.budget = budget;
        this.spent = spent;
        this.usagePercentage = usagePercentage;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getBudget() {
        return budget;
    }

    public void setBudget(double budget) {
        this.budget = budget;
    }

    public double getSpent() {
        return spent;
    }

    public void setSpent(double spent) {
        this.spent = spent;
    }

    public double getUsagePercentage() {
        return usagePercentage;
    }

    public void setUsagePercentage(double usagePercentage) {
        this.usagePercentage = usagePercentage;
    }
}
