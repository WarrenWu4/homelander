const fs = require('fs');
const csv = require('csv-parse');
const path = require('path');

async function getUserData(accountId) {
  return new Promise((resolve, reject) => {
    const results = [];
    const csvPath = path.join(__dirname, '..', 'data', 'example_networks.csv');

    // Debug logs
    console.log('Looking for account ID:', accountId);
    console.log('CSV Path:', csvPath);

    fs.createReadStream(csvPath)
      .pipe(csv.parse({ 
        columns: true, 
        trim: true,
        skip_empty_lines: true
      }))
      .on('data', (row) => {
        // Debug log for each row
        console.log('Comparing:', {
          'CSV acct_id': row.acct_id,
          'Input accountId': accountId,
          'Match': row.acct_id === accountId
        });

        if (row.acct_id === accountId) {
          console.log('Found matching account:', row);
          
          // Convert the data types appropriately
          const userData = [
            Number(row.extenders),
            Number(row.wireless_clients_count),
            Number(row.wired_clients_count),
            Number(row.rx_avg_bps),
            Number(row.tx_avg_bps),
            Number(row.rx_p95_bps),
            Number(row.tx_p95_bps),
            Number(row.rx_max_bps),
            Number(row.tx_max_bps),
            Number(row.rssi_mean),
            Number(row.rssi_median),
            Number(row.rssi_max),
            Number(row.rssi_min),
            Number(row.network_speed.replace('M', '')), // Remove 'M' and convert to number
            `${row.city},${row.state}` // Combine city and state
          ];

          results.push(userData);
        }
      })
      .on('end', () => {
        if (results.length > 0) {
          console.log('Found user data:', results[0]);
          resolve(results[0]);
        } else {
          console.log('No matching account found');
          reject(new Error('Account not found'));
        }
      })
      .on('error', (error) => {
        console.error('CSV Reading Error:', error);
        reject(error);
      });
  });
}

// Add a function to validate the CSV file structure
async function validateCSV() {
  return new Promise((resolve, reject) => {
    const csvPath = path.join(__dirname, '..', 'data', 'example_networks.csv');
    let isFirstRow = true;
    let expectedColumns = [
      'acct_id', 'extenders', 'wireless_clients_count', 'wired_clients_count',
      'rx_avg_bps', 'tx_avg_bps', 'rx_p95_bps', 'tx_p95_bps', 'rx_max_bps',
      'tx_max_bps', 'rssi_mean', 'rssi_median', 'rssi_max', 'rssi_min',
      'network_speed', 'city', 'state'
    ];

    fs.createReadStream(csvPath)
      .pipe(csv.parse({ columns: true }))
      .on('headers', (headers) => {
        console.log('CSV Headers:', headers);
        const missingColumns = expectedColumns.filter(col => !headers.includes(col));
        if (missingColumns.length > 0) {
          reject(new Error(`Missing columns: ${missingColumns.join(', ')}`));
        }
      })
      .on('data', (row) => {
        if (isFirstRow) {
          console.log('First row data:', row);
          isFirstRow = false;
        }
      })
      .on('end', () => {
        resolve(true);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

module.exports = { getUserData, validateCSV };