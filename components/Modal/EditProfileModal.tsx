// components/EditProfileModal.tsx
import { translateSkinType } from '@/app/utils/translate';
import { getAllSkinTypesFromProducts } from '@/services/product'; // Hàm fetch skin types từ product API
import { IUserProfile } from '@/types/profile';
import { Picker } from '@react-native-picker/picker'; // npm install @react-native-picker/picker
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import Modal from 'react-native-modal';
type Props = {
  isVisible: boolean;
  onClose: () => void;
  profile: IUserProfile | null;
  onSave: (data: Partial<IUserProfile>) => void;
};

export default function EditProfileModal({ isVisible, onClose, profile, onSave }: Props) {
  const [name, setName] = useState(profile?.name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [skinType, setSkinType] = useState(profile?.skinType || '');
  const [skinTypes, setSkinTypes] = useState<string[]>([]);


  useEffect(() => {
    setName(profile?.name || '');
    setPhone(profile?.phone || '');
    setSkinType(profile?.skinType || '');
  }, [profile]);

  useEffect(() => {
    const fetchSkinTypes = async () => {
      try {
        const data = await getAllSkinTypesFromProducts(); 
        setSkinTypes(data);
      } catch (err) {
        console.error('Không thể lấy loại da:', err);
      }
    };
    fetchSkinTypes();
  }, []);

  const handleSave = () => {
    onSave({ name, phone, skinType });
    onClose();
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modal}>
        <Text style={styles.title}>Chỉnh sửa thông tin</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Tên" style={styles.input} />
        <TextInput value={phone} onChangeText={setPhone} placeholder="SĐT" style={styles.input} />

        <Text style={styles.label}>Loại da</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={skinType} onValueChange={setSkinType}>
            <Picker.Item label="Chọn loại da" value="" />
            {skinTypes.map((type) => (
            <Picker.Item key={type} label={translateSkinType(type)} value={type} />
            ))}

          </Picker>
        </View>

        <Button title="Lưu" onPress={handleSave} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10
  },
  label: {
    marginBottom: 5,
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    overflow: 'hidden'
  }
});
