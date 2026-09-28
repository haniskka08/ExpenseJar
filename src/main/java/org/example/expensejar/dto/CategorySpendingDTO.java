package org.example.expensejar.dto;

public class CategorySpendingDTO {

    private String category;
    private double total;

    public CategorySpendingDTO() {
    }

    public CategorySpendingDTO(String category, double total) {
        this.category = category;
        this.total = total;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
}
