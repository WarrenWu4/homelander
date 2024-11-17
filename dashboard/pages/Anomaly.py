import streamlit as st
import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA

st.set_page_config(page_title="X-Ray - Homelander", layout="wide")

st.write("""
# Network Anomaly Detection & Risk Assessment
""")

uploaded_file = st.file_uploader("Choose a file")
if (uploaded_file is None):
    st.write("**Please upload a CSV file**")
else:
    # Can be used wherever a "file-like" object is accepted:
    df = pd.read_csv(uploaded_file)
    df.set_index('timestamp', inplace=True)

    # Fit ARIMA model (using order (1, 0, 0) as an example)
    model = ARIMA(df['bps'], order=(1, 0, 0))
    model_fit = model.fit()

    # Get residuals
    residuals = model_fit.resid

    # Calculate standard deviation and set a threshold
    threshold = 3 * residuals.std()

    # Identify outliers (residuals > threshold)
    outliers = df[abs(residuals) > threshold]

    if (len(outliers) == 0):
        st.write("**No network anomalies detected**")
    else:
        st.write("**Network Anomalies Detected**")
        st.write(outliers)

        # Plot the time series data
        st.write("### Network Traffic Over Time")
        st.line_chart(df)

        # Plot the residuals
        st.write("### Residuals")
        st.line_chart(residuals)