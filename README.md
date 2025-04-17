# Omni Dashboard Migration Assistant

A Streamlit-based web application that simplifies the process of migrating dashboards between different Omni environments. This tool provides a user-friendly interface for exporting dashboards from a source environment and importing them into a target environment.

## Features

- 🔄 Seamless dashboard migration between Omni environments
- 🔒 Secure handling of API tokens
- 🌐 Support for different Omni environments (source and target)
- 📊 Real-time validation of URLs and configuration
- 🎯 Simple and intuitive user interface
- 📝 Detailed migration results and error reporting

## Prerequisites

- Python 3.9 or higher
- pip (Python package installer)
- Access to source and target Omni environments
- API tokens for both environments

## Installation

1. Clone the repository:
```bash
git clone https://github.com/liammccarthy93/omni-migration-assistant.git
cd omni-migration-assistant
```

2. Install the required dependencies:
```bash
python3 -m pip install -r requirements.txt
```

## Configuration

The application can be configured using environment variables:

- `NEXT_PUBLIC_SOURCE_OMNI_URL`: URL of the source Omni environment
- `SOURCE_OMNI_API_TOKEN`: API token for the source environment
- `NEXT_PUBLIC_TARGET_OMNI_URL`: URL of the target Omni environment
- `TARGET_OMNI_API_TOKEN`: API token for the target environment

## Usage

1. Start the application:
```bash
python3 -m streamlit run app.py
```

2. Open your web browser and navigate to `http://localhost:8501`

3. Configure the source and target environments in the sidebar:
   - Enter the Omni URLs for both environments
   - Provide API tokens for authentication
   - Specify the source dashboard ID and target model ID

4. Click "Start Migration" to begin the process

5. Monitor the migration progress and view the results

## Security

- API tokens are handled securely and never stored
- All URLs must use HTTPS
- Input validation is performed for all configuration parameters

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
