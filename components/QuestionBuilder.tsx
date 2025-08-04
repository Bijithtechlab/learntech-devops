import { Trash2 } from 'lucide-react'

interface QuestionBuilderProps {
  question: any
  index: number
  onUpdate: (index: number, field: string, value: any) => void
  onUpdateOption: (questionIndex: number, optionIndex: number, value: string) => void
  onUpdateQuestion: (index: number, updatedQuestion: any) => void
  onRemove: (index: number) => void
}

export default function QuestionBuilder({ question, index, onUpdate, onUpdateOption, onUpdateQuestion, onRemove }: QuestionBuilderProps) {
  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'true-false', label: 'True/False' },
    { value: 'fill-blank', label: 'Fill in the Blank' },
    { value: 'essay', label: 'Essay Question' }
  ]

  const handleTypeChange = (newType: string) => {
    let newOptions = []
    let newCorrectAnswer: any = 0
    
    if (newType === 'true-false') {
      newOptions = ['True', 'False']
      newCorrectAnswer = 0
    } else if (newType === 'multiple-choice') {
      newOptions = ['', '', '', '']
      newCorrectAnswer = 0
    } else if (newType === 'fill-blank') {
      newOptions = []
      newCorrectAnswer = ''
    } else if (newType === 'essay') {
      newOptions = []
      newCorrectAnswer = ''
    }
    
    // Update all fields at once
    const updated = {
      ...question,
      type: newType,
      options: newOptions,
      correctAnswer: newCorrectAnswer
    }
    
    // Call a new function to update the entire question
    onUpdateQuestion(index, updated)
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex justify-between items-start mb-4">
        <h5 className="font-medium text-gray-900">Question {index + 1}</h5>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
            <select
              value={question.type || 'multiple-choice'}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {questionTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
            <input
              type="number"
              value={question.points}
              onChange={(e) => onUpdate(index, 'points', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
          <textarea
            value={question.question}
            onChange={(e) => onUpdate(index, 'question', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={2}
            placeholder="Enter your question here..."
          />
        </div>

        {(question.type === 'multiple-choice' || question.type === 'true-false') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options (Select the correct answer)
            </label>
            <div className="space-y-2">
              {question.options?.map((option: string, optionIndex: number) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${question.id}`}
                    checked={question.correctAnswer === optionIndex}
                    onChange={() => onUpdate(index, 'correctAnswer', optionIndex)}
                    className="text-green-600"
                  />
                  <span className="text-sm font-medium text-green-600 min-w-[60px]">
                    {question.correctAnswer === optionIndex ? 'Correct' : ''}
                  </span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => onUpdateOption(index, optionIndex, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={`Option ${optionIndex + 1}`}
                    disabled={question.type === 'true-false'}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Click the radio button next to the correct answer
            </p>
          </div>
        )}

        {question.type === 'fill-blank' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correct Answer *
            </label>
            <input
              type="text"
              value={question.correctAnswer || ''}
              onChange={(e) => onUpdate(index, 'correctAnswer', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the correct answer (case-insensitive)"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Students will need to type this exact answer (case doesn't matter)
            </p>
          </div>
        )}

        {question.type === 'essay' && (
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-800">Essay questions require manual grading by instructors.</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Explanation (Optional)</label>
          <textarea
            value={question.explanation}
            onChange={(e) => onUpdate(index, 'explanation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={2}
            placeholder="Explain the correct answer..."
          />
        </div>
      </div>
    </div>
  )
}