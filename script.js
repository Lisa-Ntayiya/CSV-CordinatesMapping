let map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 0, lng: 0 },
    zoom: 2,
  });
}

function celsiusToKelvin(celsius) {
  return parseFloat(celsius) + 273.15;
}

document.getElementById('uploadButton').addEventListener('click', () => {
  const csvFileInput = document.getElementById('csvFileInput');
  const selectedFile = csvFileInput.files[0];

  if (selectedFile) {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const csvContent = event.target.result;
      const updatedCSV = await processData(csvContent);
      downloadCSV(updatedCSV);
    };

    reader.readAsText(selectedFile);
  } else {
    alert('Please select a CSV file.');
  }
});

function processData(csvContent) {
  const csvRows = csvContent.split('\n');
  const updatedRows = [];
  
  for (const row of csvRows) {
    const columns = row.split(',');
    const latitude = parseFloat(columns[0]);
    const longitude = parseFloat(columns[1]);
    const celsiusTemp = parseFloat(columns[2]);
    
    if (!isNaN(latitude) && !isNaN(longitude) && !isNaN(celsiusTemp)) {
      const kelvinTemp = celsiusToKelvin(celsiusTemp);
      updatedRows.push(`${latitude},${longitude},${celsiusTemp},${kelvinTemp.toFixed(2)}`);
      new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: `Temperature: ${celsiusTemp}°C (${kelvinTemp.toFixed(2)} K)`,
      });
    }
  }

  return updatedRows.join('\n');
}

function downloadCSV(csvData) {
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'updated_data.csv';
  link.click();
}

