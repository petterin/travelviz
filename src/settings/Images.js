import React, { Component } from "react";
import { Row, Col } from 'antd';
import request from 'superagent';


class Images extends React.Component {
  // TODO: Access token from Firebase
  constructor(props) {
    super(props);
    this.state = {
      photos: []
    }
  }

  componentDidMount() {
    this.fetchPhotos();
  }

  fetchPhotos() {
    request
      .get('https://api.instagram.com/v1/users/self/media/recent/?access_token=8607033444.84cde46.b9bd2f87d48a4a2c8bcda7a415e0d8d2')
      .then((res) => {
        this.setState({
          photos: res.body.data
        })
      })
  }

render() {
    return (
      <Row gutter={16} className="Images">
        {this.state.photos.map((photo) => {
          return (
            <Col span={8} key={photo.id} className={'location.' + photo.location.id}>
              <a href={photo.link}>
                <img src={photo.images.standard_resolution.url} alt={photo.caption}/>
              </a>
            </Col>
          )
        })}
      </Row>
    );
  }
}

export default Images;