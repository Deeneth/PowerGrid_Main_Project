# app.py
# Step 4: Streamlit dashboard for POWERGRID material forecasting

import streamlit as st
from predict import predict_materials

# ---------- Page settings ----------
st.set_page_config(
    page_title="POWERGRID Material Forecasting",
    layout="centered",
    initial_sidebar_state="expanded"
)

st.title("⚡ POWERGRID Material Demand Forecasting")
st.write("Predict required materials for upcoming POWERGRID projects to avoid delays and cost overruns.")

# ---------- Sidebar Inputs ----------
st.sidebar.header("Project Input Details")

budget = st.sidebar.number_input("Budget (Cr)", min_value=1, max_value=100, value=10)
location = st.sidebar.selectbox("Location", [
    "Delhi","Gujarat","Karnataka","Kerala","Madhya Pradesh",
    "Maharashtra","Odisha","Rajasthan","Tamil Nadu","Telangana"
])
tower_type = st.sidebar.selectbox("Tower Type", ["132kV","220kV","400kV"])
substation_type = st.sidebar.selectbox("Substation Type", ["AIS","GIS"])
terrain = st.sidebar.selectbox("Terrain", ["Coastal","Hilly","Mountain","Plain"])
tax = st.sidebar.number_input("Tax (%)", min_value=0, max_value=50, value=18)

# ---------- Predict Button ----------
if st.button("Predict Materials"):
    try:
        # Call the predict function
        result = predict_materials(
            budget=budget,
            location=location,
            tower_type=tower_type,
            substation_type=substation_type,
            terrain=terrain,
            tax=tax
        )

        if result is not None:
            st.success("✅ Prediction complete!")
            st.subheader("Predicted Material Requirements")

            # ------------------------
            # PyArrow-free Markdown table
            # ------------------------
            if isinstance(result, dict):
                table_md = "| Material | Predicted Quantity |\n"
                table_md += "|----------|-----------------|\n"
                for k, v in result.items():
                    table_md += f"| {k} | {float(v):.2f} |\n"
                st.markdown(table_md)
            else:
                st.text(str(result))

        else:
            st.error("❌ Prediction returned no result. Check your input values.")

    except Exception as e:
        st.error(f"⚠️ Error: {e}")

# ---------- Footer ----------
st.markdown("---")
st.markdown(
    "Made with ❤ by Team Datronix.  "
    "Step 1–3 scripts handle preprocessing, training, and prediction."
)
