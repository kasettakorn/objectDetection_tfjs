import React from 'react';
import { Layout } from 'antd';
import './styles/App.css';

const { Header, Content, Footer } = Layout;
function App() {
  return (
    <div>
    <Layout>
        <Header style={{
          height: "100vh",
          width: "100%",
          paddingBottom: '10px',
          backgroundColor: "#485461",
          backgroundImage: "linear-gradient(315deg, #485461 0%, #28313b 74%)"
        }}>
            <h1> 🦠 Object Detection</h1>
            <h3> Realtime Data from Tensorflow.js </h3>

        </Header>
        <Content>

        </Content>
        <Footer>

        </Footer>
      </Layout>      
    </div>
 

  );
}

export default App;
