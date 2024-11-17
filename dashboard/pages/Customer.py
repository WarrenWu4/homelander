import streamlit as st
import pandas as pd

st.set_page_config(page_title="X-Ray - Homelander", layout="wide")

st.write("""
# Customer Troubleshooting
""")

@st.cache_data
def load_data():
    df = pd.read_csv("data/example_networks.csv")
    return df

# filter by customer id
df = load_data()
customer_id = st.text_input("**Enter a customer ID**", "Enter ID here")
customer_data = df.loc[df['acct_id'] == customer_id]

if (customer_data.empty):
    st.write("**No data found for this customer ID**")
else:
    # customer network usage divided by download and upload
    st.write("### Transmitted vs. Received")
    filtered_data = pd.DataFrame({
        "Communication Type": ["Transmitted", "Transmitted", "Transmitted", "Received", "Received", "Received"],
        "Mbps": [customer_data['tx_avg_bps'].values[0]/1_000_000, customer_data['tx_p95_bps'].values[0]/1_000_000,customer_data['tx_max_bps'].values[0]/1_000_000, customer_data['rx_avg_bps'].values[0]/1_000_000, customer_data['rx_p95_bps'].values[0]/1_000_000, customer_data['rx_max_bps'].values[0]/1_000_000],
        "site": ['avg_bps', 'p95_bps', 'max_bps', 'avg_bps', 'p95_bps', 'max_bps']
    }, columns=['Communication Type', 'Mbps', "site"])
    st.bar_chart(filtered_data, x="Communication Type", y="Mbps", color="site", stack=False)
    
    st.write("**Insights**")

    # rssi metrics to look at overall signal strength
    st.write("### RSSI Metrics")
    filtered_data = pd.DataFrame({
        "RSSI": ["", "", "", ""],
        "dBm": [customer_data['rssi_min'].values[0], customer_data['rssi_mean'].values[0], customer_data['rssi_median'].values[0], customer_data['rssi_max'].values[0]],
        "site": ['rssi_min','rssi_mean', 'rssi_median', 'rssi_max']
    })
    st.bar_chart(filtered_data, x="RSSI", y="dBm", color="site", stack=False)

    st.write("**Insights**")

    # whether the user needs more or less extenders based on their connected clients
    st.write("### Extenders vs. Clients")
    filtered_data = pd.DataFrame({
        "Label": ["Extenders", "Wireless Clients", "Wired Clients"],
        "Count": [customer_data['extenders'].values[0], customer_data['wireless_clients_count'].values[0], customer_data['wired_clients_count'].values[0]],
        "site": ['extenders', 'wireless_clients_count', 'wired_clients_count']
    })
    st.bar_chart(filtered_data, x="Label", y="Count", color="site", stack=False)

    st.write("**Insights**")

    # how close the user's network usage is to their max network speed 
    st.write("### Network Speed & Usage")
    filtered_data = pd.DataFrame({
        "Label": ["Network Speed", "Network Usage (Received)", "Network Usage (Transmitted)"],
        "Mbps": [float(customer_data['network_speed'].values[0][:-1]), (customer_data['rx_max_bps'].values[0]/1_000_000), (customer_data['tx_max_bps'].values[0]/1_000_000)]
    })
    st.bar_chart(filtered_data, x="Label", y="Mbps", horizontal=True)

    st.write("**Insights**")


