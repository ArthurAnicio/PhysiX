import api from '../../services/api';
import {Response, Request} from 'express';
import Post from '../../components/post';



function TestPage() {

    async function testingFun () {    
        const response = await api.get('/test')
        console.log(response)  
    }
    
    

    return (
        <div id='teste'>
            <button onClick={testingFun}>Testar</button>
            <Post/>
        </div>
    )
}

export default TestPage