import mongoose, { Document, Schema } from "mongoose";

export interface IExpense extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: Date;
}

const expensSchema = new Schema<IExpense>({
  userId: {
    type: Schema.Types.ObjectId,
    ref:'user',
    required: true,
  },
  amount:{
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive']
  },
  category:{
    type: String,
    required: [true,'Amount is required'],
    enum: ['Food','Transport','Entertainment','Shopping','Bills','Health','Others']
  },
  description:{
    type: String,
    required: [true, 'Description is required'],
    trim:true
  },
  date:{
    type: String,
    required: true,
  },
  createdAt:{
    type: Date,
    default: Date.now
  }
});


// Index for faster queries
expensSchema.index({userId: 1, date: -1});
expensSchema.index({userId: 1, category: 1});

export default mongoose.model<IExpense>('Expense',expensSchema);