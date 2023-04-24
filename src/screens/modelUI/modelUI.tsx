import CryptoJS from 'crypto-js';
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, TextInput, View} from 'react-native';
import {DataModel, Field} from '../selectDataModel/types';
import {styles} from './styles';

interface ModelUIProps {
  model: DataModel;
}

const ModelUI: React.FC<ModelUIProps> = ({model}) => {
  const [fields, setFields] = useState<{[key: string]: Field}>({});

  useEffect(() => {
    setFields({...model.fields});
  }, [model]);

  const handleInputChange = (key: string, value: string) => {
    const newFields = {...fields};
    newFields[key].value = value;
    setFields(newFields);
    calculateAndUpdateFields(key, value);
  };

  const calculateAndUpdateFields = async (key: string, value: string) => {
    const newFields = {...fields};
    let updateRequired = false;

    if (
      model.name === 'String Hash' &&
      (key === 'string1' || key === 'string2')
    ) {
      if (newFields.string1.value && newFields.string2.value) {
        newFields.hash.value = CryptoJS.HmacSHA256(
          newFields.string2.value.toString(),
          newFields.string1.value.toString(),
        ).toString();
        updateRequired = true;
      }
    } else if (model.name === 'Number Statistics' && key.startsWith('number')) {
      const numbers: number[] = [];
      for (let i = 1; i <= 10; i++) {
        const numKey = 'number' + i;
        const numValue = Number(newFields[numKey].value);
        if (!isNaN(numValue)) {
          numbers.push(numValue);
        }
      }

      if (numbers.length === 10) {
        const sum = numbers.reduce((a, b) => a + b, 0);
        const mean = sum / 10;
        newFields.mean.value = mean.toFixed(2);

        const sortedNumbers = [...numbers].sort((a, b) => a - b);
        const median = (sortedNumbers[4] + sortedNumbers[5]) / 2;
        newFields.median.value = median.toFixed(2);

        const squareDiffs = numbers.map(num => Math.pow(num - mean, 2));
        const variance = squareDiffs.reduce((a, b) => a + b, 0) / 10;
        const stddev = Math.sqrt(variance);
        newFields.stddev.value = stddev.toFixed(2);

        updateRequired = true;
      }
    }

    if (updateRequired) {
      setFields(newFields);
    }
  };

  return (
    <ScrollView>
      {Object.keys(fields).map(key => {
        const field = fields[key];
        return (
          <View key={key} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <TextInput
              keyboardType={field.type === 'int' ? 'number-pad' : 'default'}
              onChangeText={value => handleInputChange(key, value)}
              editable={!field.readOnly}
              value={field.value ? field.value.toString() : ''}
              style={styles.input}
            />
          </View>
        );
      })}
    </ScrollView>
  );
};

export default ModelUI;
