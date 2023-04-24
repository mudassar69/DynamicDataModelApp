import {Picker} from '@react-native-picker/picker';
import React, {useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import dataModel1 from '../../assets/dataModel1.json';
import dataModel2 from '../../assets/dataModel2.json';
import ModelUI from '../modelUI';
import {styles} from './styles';
import {DataModel} from './types';

const DATA_MODELS: DataModel[] = [dataModel1, dataModel2];

const SelectDataModel = () => {
  const [selectedModel, setSelectedModel] = useState<DataModel | null>(null);

  const handleModelChange = (model: DataModel | null) => {
    setSelectedModel(model);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Picker
          selectedValue={selectedModel}
          onValueChange={handleModelChange}
          style={styles.picker}>
          <Picker.Item label="Select a data model" value={null} />
          {DATA_MODELS.map((model, index) => (
            <Picker.Item key={index} label={model.name} value={model} />
          ))}
        </Picker>
      </View>
      {selectedModel && <ModelUI model={selectedModel} />}
    </SafeAreaView>
  );
};

export default SelectDataModel;
