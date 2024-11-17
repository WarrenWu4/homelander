import streamlit as st
import pandas as pd
import numpy as np


def load_page():
    st.map(df, latitude="latitude", longitude="longitude", size=st.session_state["column"], color=(200, 0, 0, 0.5))

def load_data():
    new_df = pd.read_csv("data/preprocessed_customers.csv")
    return new_df

st.set_page_config(page_title="X-Ray - Homelander", layout="wide")

st.write("""
# Location Analysis
""")

st.selectbox(
    "**Select feature to analyze**",
    ['extenders', 'wireless_clients_count', 'wired_clients_count', 'rx_avg_bps', 'tx_avg_bps', 'rx_p95_bps', 'tx_p95_bps', 'rx_max_bps', 'tx_max_bps', 'rssi_mean', 'rssi_median', 'rssi_max', 'rssi_min','network_speed'],
    key="column"
)

df = load_data()
load_page()
    
st.write("""**Insights**
         
Placeholder text         
""")