import { useState, ChangeEvent } from 'react';

interface FormData {
  pan: string;
  aadhar: string;
  address: string;
}

const DonateForm = () => {
  const [show80GFields, setShow80GFields] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    pan: '',
    aadhar: '',
    address: '',
  });

  const handleCheckboxChange = () => {
    setShow80GFields(!show80GFields);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDonate = async () => {
    const paymentSuccess = true;

    if (paymentSuccess && show80GFields) {
      const { pan, aadhar, address } = formData;
      if (!pan || !aadhar || !address) {
        alert('Please fill all fields for 80G exemption.');
        return;
      }

      try {
        const response = await fetch(
          'https://script.google.com/macros/s/AKfycbz81UKQ8bJr8fPvp3nF2BUxvALYa5ivhRHo0OP2xtM5GDc3taTNKVbvTF6gBlkpILVh/exec',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pan, aadhar, address }),
          }
        );

        if (response.ok) {
          alert('Thank you! Details submitted successfully.');
          setFormData({ pan: '', aadhar: '', address: '' });
          setShow80GFields(false);
        } else {
          alert('Failed to submit details.');
        }
      } catch (err) {
        console.error(err);
        alert('Error connecting to server.');
      }
    } else {
      alert('Payment completed!');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto rounded-xl shadow-md bg-white space-y-4 text-black">
      <h2 className="text-2xl font-semibold">Donate Now</h2>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={show80GFields}
          onChange={handleCheckboxChange}
          className="w-5 h-5"
        />
        <span>Would you like your donation to be exempt from the 80G tax?</span>
      </label>

      {show80GFields && (
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-sm">
              PAN Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pan"
              value={formData.pan}
              onChange={handleChange}
              placeholder="To obtain the certificate for 80-G"
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium text-sm">
              Aadhar Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="aadhar"
              value={formData.aadhar}
              onChange={handleChange}
              placeholder="Enter your Aadhar number"
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium text-sm">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your full address"
              rows={4}
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>
        </div>
      )}

      <button
        onClick={handleDonate}
        className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl"
      >
        Donate
      </button>
    </div>
  );
};

export default DonateForm;
