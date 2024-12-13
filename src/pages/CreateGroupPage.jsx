import React,{ useId } from 'react'
import Card from '../components/Card'
import TextBox from '../components/TextBox'
import Button from '../components/Button'
import { useState } from 'react'

const CreateGroupPage = () => {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null)
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const handleClick = async () => {
        /*try {
            const response = await axios.post('http://localhost:5000/api/login', {
                username: username,
                password: password, 
            });
            alert('Login successful:', response.data);
        } catch (error) {
            alert('Error during login:', error);
        } */       
    };
    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
          setImage(URL.createObjectURL(event.target.files[0]));
        }
       }
    return (
        <div className="container-xl lg:container m-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
                <Card>
                    <h2 className="text-2xl font-bold mb-4">Create a New Group</h2>
                    <TextBox
                        ph = "group name" 
                        mb="mb-4"
                        onChange={(event) => setName(event.target.value)}
                     />
                    <textarea name="description" placeholder="Describe the product..."
                    rows={4} cols={40} className={`mb-4 p-2 border border-gray-300 rounded-lg`}
                    onChange={(event) => setDescription(event.target.value)}/>
                    <hr className='mb-0'/>
                    <h6>Product Image:</h6>
                    <label>
                        <input name="image" onChange={onImageChange} type="file" accept=".png,.jpg"/>
                        <img alt="no image uploaded" src={image}/>
                    </label>
                    <h6 className="text-l font-bold mb-2">Deal Information</h6>
                    <label>
                        <label>Original Price:</label>
                        <input name="original-price" type="number" min='0'/>
                    </label>
                    <hr className='mb-0'/>
                    <label>
                        <label>Discount:</label>
                        <input name="discount" type="number" min='0' max='100'/>
                        <label>%</label>
                    </label>
                    <hr className='mb-0'/>
                    <label>Discounted value:</label>
                    <hr className='mb-4'/>
                    <label>
                        <label>Minimum Group Size:</label>
                        <input name="min-size" type="number" min='1'/>
                        <label>%</label>
                    </label>
                    <hr className='mb-4'/>
                    <Button label="Create Group" className="mb-4" onClick={handleClick}/>
                </Card>
            </div>
        </div>
    )
}

export default CreateGroupPage;