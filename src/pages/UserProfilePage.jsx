import { Routes, Route, useSearchParams } from 'react-router-dom';
import Card from '../components/Card'

const UserProfilePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const  user = searchParams.get('user');
    return (
        <div className="container-xl lg:container m-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
                <Card>
                    <h2 className="text-2xl font-bold mb-4">{user}</h2>
                    <h4 className="text-2xl mb-4">Past Deals:</h4>
                </Card>
            </div>
        </div>
    )
}
export default UserProfilePage