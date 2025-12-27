const registerAdmin = async () => {
    try {
        const payload = {
            email: 'a.vishnuvardhanreddy01@gmail.com',
            password: 'Vishnu@123',
            name: 'Dr. Vishnuvardhan Reddy',
            roll_number: 'FACULTY-01',
            year: 'N/A',
            semester: 'N/A'
        };

        console.log('Attempting to register admin...');
        const res = await fetch('http://localhost:5001/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
            console.log('Success:', data);
        } else {
            console.error('Registration failed:', data);
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
};

registerAdmin();
