import React, { Component } from "react";
import "./ShopSearch.css";

const elementStyle = {
  border: "solid",
  borderColor: "grey",
  borderRadius: "10px",
  position: "relative",
  height: "3vh",
  width: "20vh",
  marginTop: "5vh",
  marginBottom: "10vh",
};

const buttonStyle = {
  margin: "2px",
};

const styleInfo = {
  padding: "5px 10px",
  display: "block",
};

export default class ShopSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shops: [],
      categories: [],
      search: "",
      searchCat: "",
    };
  }

  fecthData() {
    fetch("https://app.venue.in.th/demo/demo-shops.json")
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          shops: response.data,
        });
      })

      .catch((error) => console.log("parsing failed", error));
  }

  componentDidMount() {
    this.fecthData();
  }

  handleCategoryChange = (e) => {
    this.setState({ searchCat: e.target.value === "All" ? "" : e.target.value });
  };

  handleChange = (e) => {
    e.preventDefault();
    this.setState({ search: e.target.value });
  };

  renderButton = () => {
    if (this.state.shops != null) {
      const cats = [];

      this.state.shops.map((data) => {
        data.categories.map((item) => {
          cats.push({ categories: item.en });
        });
      });

      const uniqueCats = [...new Set(cats.map(JSON.stringify))].map(JSON.parse);

      return uniqueCats.map((cat) => {
        return (
          <button
            key={cat.categories}
            value={cat.categories}
            style={buttonStyle}
            onClick={(e) => this.handleCategoryChange(e)}
          >
            {cat.categories}
          </button>
        );
      });
    }
  };

  render() {
    const { shops } = this.state;

    const filterData = shops
      .filter((data) => {
        if (this.state.search === "" && this.state.searchCat === "") {
          return data;
        } else if (
          data.title.en
            .toLowerCase()
            .includes(this.state.search.toLowerCase()) ||
          data.description
            .toString()
            .toLowerCase()
            .includes(this.state.search.toLowerCase()) ||
          data.keywords
            .toString()
            .toLowerCase()
            .includes(this.state.search.toLowerCase())
        ) {
          let isMatch = true;
          isMatch = data.categories.some((item) =>
            item.en
              .toString()
              .toLowerCase()
              .includes(this.state.searchCat.toLowerCase())
          );
          if (isMatch) return data;
        }
      })
      .map((data) => {
        return (
          <div className="item-wrap">
            <img src={data.logo} className="logo-img"></img>
            <span style={styleInfo}>
              <b>{data.title.en}</b>
            </span>
            <br />
            <span>{data.description.en}</span>
          </div>
        );
      });

    return (
      <div>
        <label>Search </label>
        <input
          type="text"
          placeholder="Enter keyword"
          style={elementStyle}
          onChange={(e) => this.handleChange(e)}
        />
        <br />
        <button
          key="All"
          value="All"
          style={buttonStyle}
          onClick={(e) => this.handleCategoryChange(e)}
        >
          All
        </button>
        {this.renderButton()}
        <br />
        <br />
        <hr />
        <br />
        <h1>Search Result</h1>
        <div style={{ display: "block" }}>{filterData}</div>
      </div>
    );
  }
}
