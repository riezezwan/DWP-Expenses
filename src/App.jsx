// Full version with filter + PDF/Excel export by date and department
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, PieChart, FileText, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const departments = [
  { name: "Wardrobe", allocated: 5000, spent: 4200 },
  { name: "Props", allocated: 3000, spent: 2500 },
  { name: "Technical", allocated: 8000, spent: 6000 },
  { name: "F&B", allocated: 4000, spent: 3700 },
  { name: "Makeup" }, { name: "Transport" }, { name: "Talent" },
  { name: "Handy" }, { name: "Stationary" }, { name: "Rental" },
  { name: "Misc" }, { name: "Pre Pro" }
];

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState({ date: "", department: "" });

  const filteredExpenses = expenses.filter(exp => {
    const dateMatch = filters.date ? exp.date === filters.date : true;
    const deptMatch = filters.department ? exp.department === filters.department : true;
    return dateMatch && deptMatch;
  });

  const handleExportFiltered = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredExpenses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Report");
    XLSX.writeFile(workbook, "Filtered_Expenses_Report.xlsx");
  };

  const handleExportFilteredPDF = () => {
    const doc = new jsPDF();
    doc.text("Filtered Expenses Report", 14, 16);
    doc.autoTable({
      head: [["Date", "Department", "Description", "Amount", "Day"]],
      body: filteredExpenses.map(exp => [
        exp.date,
        exp.department,
        exp.description,
        `RM ${parseFloat(exp.amount).toLocaleString()}`,
        exp.day
      ]),
      startY: 20,
      styles: { fontSize: 8 }
    });
    doc.save("Filtered_Expenses_Report.pdf");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🎬 DARKWAVE PICTURES EXPENSES DASHBOARD</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="flex gap-2">
          <input type="date" className="border p-2 rounded" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
          <select className="border p-2 rounded" value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })}>
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.name}>{dept.name}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportFilteredPDF} className="bg-red-600 text-white"><FileText className="w-4 h-4" /> Export PDF</Button>
          <Button onClick={handleExportFiltered} className="bg-green-600 text-white"><FileText className="w-4 h-4" /> Export Excel</Button>
        </div>
      </div>

      {/* Report Table */}
      <div className="border rounded p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Filtered Report</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th>Date</th>
              <th>Department</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Day</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((exp, idx) => (
              <tr key={idx} className="border-b">
                <td>{exp.date}</td>
                <td>{exp.department}</td>
                <td>{exp.description}</td>
                <td>RM {parseFloat(exp.amount).toLocaleString()}</td>
                <td>{exp.day}</td>
              </tr>
            ))}
            {filteredExpenses.length === 0 && (
              <tr><td colSpan={5} className="text-center py-4 text-gray-400">No data found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
