import streamlit as st
import os
from typing import Optional
import json
import requests
from dataclasses import dataclass
from urllib.parse import urlparse

@dataclass
class OmniEnvironment:
    base_url: str
    token: str

class OmniAPI:
    def __init__(self, environment: OmniEnvironment):
        self.environment = environment

    def _fetch(self, endpoint: str, method: str = "GET", data: Optional[dict] = None) -> dict:
        headers = {
            "Authorization": f"Bearer {self.environment.token}",
            "Content-Type": "application/json",
        }
        
        url = f"{self.environment.base_url}{endpoint}"
        
        if method == "GET":
            response = requests.get(url, headers=headers)
        else:
            response = requests.post(url, headers=headers, json=data)
            
        if not response.ok:
            error_detail = response.json().get("detail", response.text)
            raise Exception(f"Omni API Error: {error_detail}")
            
        return response.json()

    def export_dashboard(self, dashboard_id: str) -> dict:
        return self._fetch(f"/api/unstable/documents/{dashboard_id}/export")

    def import_dashboard(self, data: dict) -> dict:
        return self._fetch("/api/unstable/documents/import", method="POST", data=data)

def validate_url(url: str) -> tuple[bool, str]:
    """Validate URL format and scheme."""
    if not url:
        return False, "URL is required"
    
    if not url.startswith("https://"):
        return False, "URL must start with https://"
    
    try:
        result = urlparse(url)
        if not all([result.scheme, result.netloc]):
            return False, "Invalid URL format"
        return True, ""
    except Exception:
        return False, "Invalid URL format"

def validate_config(source_url: str, source_token: str, target_url: str, target_token: str) -> tuple[bool, list[str]]:
    """Validate all configuration parameters."""
    errors = []
    
    # Validate source URL
    is_valid_source_url, source_url_error = validate_url(source_url)
    if not is_valid_source_url:
        errors.append(f"Source URL: {source_url_error}")
    
    # Validate target URL
    is_valid_target_url, target_url_error = validate_url(target_url)
    if not is_valid_target_url:
        errors.append(f"Target URL: {target_url_error}")
    
    # Validate tokens
    if not source_token:
        errors.append("Source API token is required")
    if not target_token:
        errors.append("Target API token is required")
    
    return len(errors) == 0, errors

def main():
    st.set_page_config(
        page_title="Omni Dashboard Migration Assistant",
        page_icon="🔄",
        layout="wide"
    )

    st.title("🔄 Omni Dashboard Migration Assistant")
    st.markdown("""
    This tool helps you migrate dashboards between Omni environments.
    """)

    # Sidebar for configuration
    with st.sidebar:
        st.header("Configuration")
        
        # Source environment
        st.subheader("Source Environment")
        source_url = st.text_input(
            "Source Omni URL",
            value=os.getenv("NEXT_PUBLIC_SOURCE_OMNI_URL", ""),
            help="Must start with https:// (e.g., https://source-company.omniapp.co)"
        )
        # Show immediate validation for source URL
        if source_url:
            is_valid, error = validate_url(source_url)
            if not is_valid:
                st.error(error)
                
        source_token = st.text_input(
            "Source API Token",
            type="password",
            value=os.getenv("SOURCE_OMNI_API_TOKEN", ""),
            help="Your Omni API token for the source environment"
        )

        # Target environment
        st.subheader("Target Environment")
        target_url = st.text_input(
            "Target Omni URL",
            value=os.getenv("NEXT_PUBLIC_TARGET_OMNI_URL", ""),
            help="Must start with https:// (e.g., https://target-company.omniapp.co)"
        )
        # Show immediate validation for target URL
        if target_url:
            is_valid, error = validate_url(target_url)
            if not is_valid:
                st.error(error)
                
        target_token = st.text_input(
            "Target API Token",
            type="password",
            value=os.getenv("TARGET_OMNI_API_TOKEN", ""),
            help="Your Omni API token for the target environment"
        )

    # Validate all configuration
    is_valid_config, config_errors = validate_config(source_url, source_token, target_url, target_token)
    if not is_valid_config:
        for error in config_errors:
            st.error(error)
        return

    # Create API clients
    source_api = OmniAPI(OmniEnvironment(source_url, source_token))
    target_api = OmniAPI(OmniEnvironment(target_url, target_token))

    # Input fields
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Source Dashboard")
        source_dashboard_id = st.text_input(
            "Source Dashboard ID",
            help="The ID of the dashboard you want to migrate"
        )
        if source_dashboard_id:
            st.info(f"Source Environment: {source_url}")

    with col2:
        st.subheader("Target Model")
        target_model_id = st.text_input(
            "Target Model ID",
            help="The ID of the model where you want to import the dashboard"
        )
        if target_model_id:
            st.info(f"Target Environment: {target_url}")

    # Migration button
    if st.button("Start Migration", type="primary", disabled=not all([source_dashboard_id, target_model_id])):
        try:
            with st.spinner("Exporting dashboard from source environment..."):
                export_data = source_api.export_dashboard(source_dashboard_id)
                st.success("Dashboard exported successfully!")

            with st.spinner("Importing dashboard to target environment..."):
                import_result = target_api.import_dashboard({
                    "baseModelId": target_model_id,
                    "dashboard": export_data["dashboard"],
                    "document": export_data["document"],
                    "workbookModel": export_data["workbookModel"],
                    "exportVersion": "0.1"
                })
                st.success("Dashboard imported successfully!")

            # Display results
            st.subheader("Migration Results")
            st.json({
                "new_dashboard_id": import_result["dashboard"]["dashboardId"],
                "workbook_id": import_result["workbook"]["id"],
                "workbook_name": import_result["workbook"]["name"]
            })

        except Exception as e:
            st.error(f"Migration failed: {str(e)}")

if __name__ == "__main__":
    main() 