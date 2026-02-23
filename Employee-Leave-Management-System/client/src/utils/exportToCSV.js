export const exportToCSV = (data, filename) => {
  if (!data || !data.length) {
    return;
  }

  // Extract headers
  const headers = Object.keys(data[0]);

  // Convert array of objects to CSV string
  const csvContent = [
    headers.join(","), // Header row
    ...data.map((row) =>
      headers
        .map((fieldName) => {
          let cellData = row[fieldName];
          // Handle nested objects or arrays if necessary (basic serialization)
          if (cellData === null || cellData === undefined) {
            cellData = "";
          } else if (fieldName === "employee" && typeof cellData === "object" && cellData.name) {
            cellData = cellData.name;
          } else if (typeof cellData === "object") {
            cellData = JSON.stringify(cellData);
          }

          // Escape quotes and commas
          cellData = String(cellData).replace(/"/g, '""');
          return `"${cellData}"`;
        })
        .join(","),
    ),
  ].join("\n");

  // Create a Blob and trigger a download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
