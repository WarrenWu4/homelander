const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const csv = require('csv-parse');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors({origins: '*'}));
app.use(express.json());

// Function to get user data from CSV
const findUserInCSV = (accountId) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(path.join(__dirname, 'data', 'example_networks.csv'))
      .pipe(csv.parse({ columns: true, trim: true }))
      .on('data', (row) => {
        if (row.acct_id === accountId) {
          const userData = [
            row.extenders,
            row.wireless_clients_count,
            row.wired_clients_count,
            row.rx_avg_bps,
            row.tx_avg_bps,
            row.rx_p95_bps,
            row.tx_p95_bps,
            row.rx_max_bps,
            row.tx_max_bps,
            row.rssi_mean,
            row.rssi_median,
            row.rssi_max,
            row.rssi_min,
            row.network_speed,
            row.city,
            row.state
          ].join(',');
          results.push(userData);
        }
      })
      .on('end', () => {
        if (results.length > 0) {
          resolve(results[0]);
        } else {
          reject(new Error('Account not found'));
        }
      })
      .on('error', (error) => reject(error));
  });
};

// Function to run Python model
const runPythonModel = async (userData) => {
  return new Promise((resolve, reject) => {
    // Try different Python commands
    const pythonCommands = ['python3', 'python', 'py'];
    let currentCommand = 0;

    const tryPythonCommand = () => {
      if (currentCommand >= pythonCommands.length) {
        reject(new Error('Python not found. Please install Python 3.'));
        return;
      }

      const pythonCmd = pythonCommands[currentCommand];
      console.log(`Trying Python command: ${pythonCmd}`);

      const pythonProcess = spawn(pythonCmd, [
        path.join(__dirname, 'model_script.py')
      ]);

      let result = '';
      let error = '';

      pythonProcess.stdout.on('data', (data) => {
        console.log('Python output:', data.toString());
        result += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error('Python error:', data.toString());
        error += data.toString();
      });

      pythonProcess.on('error', (err) => {
        console.error(`Error with ${pythonCmd}:`, err);
        currentCommand++;
        tryPythonCommand();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Python process exited with code ${code}`);
          console.error('Error output:', error);
          reject(new Error(error || 'Model prediction failed'));
        } else {
          resolve(result.trim());
        }
      });

      // Send input data to Python
      pythonProcess.stdin.write(userData + '\n');
      pythonProcess.stdin.end();
    };

    tryPythonCommand();
  });
};

// Main endpoint for recommendations
// In your /api/recommendations endpoint
app.post('/api/recommendations', async (req, res) => {
    try {
      const { accountId } = req.body;
      console.log('Received request for account:', accountId);
  
      if (!accountId) {
        return res.status(400).json({ error: 'Account ID is required' });
      }
  
      const userData = await findUserInCSV(accountId);
      console.log('User data:', userData);
  
      const modelOutput = await runPythonModel(userData);
      console.log('Model output:', modelOutput);
  
      // Parse the JSON output from Python
      const recommendations = JSON.parse(modelOutput);
  
      res.json({
        success: true,
        recommendations: recommendations.recommendations,
        userData: userData
      });
  
    } catch (error) {
      console.error('Error:', error.message);
      res.status(error.message === 'Account not found' ? 404 : 500)
        .json({ error: error.message });
    }
  });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
  // Check Python installation
  const checkPython = spawn('python3', ['--version']);
  checkPython.on('error', () => {
    console.error('WARNING: Python 3 not found in PATH');
  });
  checkPython.stdout.on('data', (data) => {
    console.log('Python version:', data.toString().trim());
  });
});