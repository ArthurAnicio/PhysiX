import api from '../../services/api';
import {Response, Request} from 'express';


function TestPage() {

    async function testingFun () {    
        const response = await api.get('/test')
        console.log(response)  
    }
    
    

    return (
        <div>
            <button onClick={testingFun}>Testar</button>
        </div>
    )
}

export default TestPage