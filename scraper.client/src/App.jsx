import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
    const [output, setOutput] = useState("0");

    const handleError = (err) => {
        toast.error(err);
    };

    return (
        <div>
            <InputForm onSubmit={get} />
            <form className="form"><label>Output:</label><label>{output}</label></form>
            <ToastContainer />
        </div>
    );


    async function get(keyword = '', url = '') {
        if (isValidUrl(url) && isValidKeyword(keyword)) {
            try {
                const call = `/scraper?keyword=${encodeURIComponent(keyword)}&url=${encodeURIComponent(url)}`;
                const response = await fetch(call);

                if (response.ok) {
                    const result = await response.json();
                    console.log(result);
                    setOutput(result.urlCount);
                }
                else {
                    handleError("Error Scraping URL");
                    console.error(`Error: ${response.status} - ${response.statusText}`);
                }
            }
            catch (error) {
                handleError("Error Scraping URL");
                console.error('Fetch error:', error);
            }
        }
    }

    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        }
        catch (error) {
            handleError("Invalid URL");
            console.error('Invalid url:', error);
            return false;
        }
    }

    function isValidKeyword(keyword) {
        var valid = keyword != null && keyword.trim() !== '';

        if (valid) {
            return true;
        }
        else {
            handleError("Invalid Keyword");
            return false;
        }
    }
}

function InputForm({ onSubmit }) {
    const [keyword, setKeyword] = useState('');
    const [url, setUrl] = useState('');

    const handleKeywordChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(keyword, url);
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="keyword">Keyword:</label>
                    <input
                        type="text"
                        id="keyword"
                        value={keyword}
                        onChange={handleKeywordChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="url">URL:</label>
                    <input
                        type="text"
                        id="url"
                        value={url}
                        onChange={handleUrlChange}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default App;