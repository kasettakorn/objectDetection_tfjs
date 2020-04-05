import React from 'react';
import { Layout } from 'antd';
import ObjectDetection from './Components/ObjectDetection'
import './styles/App.css';

const { Header, Content, Footer } = Layout;
function App() {
  return (
    <div>
    <Layout>
        <Header style={{
          height: "25%",
          width: "100%",
          paddingBottom: '10px',
          backgroundColor: "#485461",
          backgroundImage: "linear-gradient(315deg, #485461 0%, #28313b 74%)"
        }}>
            <div className="headerText">
              <h1> 🔎 Object Detection 🔍</h1>
              <h3> Realtime Data from Tensorflow.js </h3>              
            </div>
        </Header>
        <Content>
          <ObjectDetection />

        </Content>
        <Footer>
          <center>
            Develop by Ronnakorn Hompoa ©2020
            Implemented by Tensorflow from NPM
          </center>
        </Footer>
      </Layout>      
    </div>
 

  );
}

export default App;
