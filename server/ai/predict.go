// ai/predict.go
package ai

import (
	"bytes"
	"encoding/json"
	"os/exec"
)

type PredictionResult struct {
	Prediction string  `json:"prediction"`
	Confidence float64 `json:"confidence"`
}

func PredictWithPython(features []float64) (*PredictionResult, error) {
	jsonInput, err := json.Marshal(features)
	if err != nil {
		return nil, err
	}

	cmd := exec.Command("python", "models/predict.py", string(jsonInput))
	var out bytes.Buffer
	cmd.Stdout = &out

	if err := cmd.Run(); err != nil {
		return nil, err
	}

	var result PredictionResult
	if err := json.Unmarshal(out.Bytes(), &result); err != nil {
		return nil, err
	}

	return &result, nil
}
