const Skill = require('../models/Skill');

exports.getAllSkills = async (req, res) =>{
const skills = await Skill.find({isDeleted: !true});
  if (skills) {
    var kq=[];
    for (let i = 0; i<skills.length; i++)
      kq.push(skills[i].name);
       return res.status(200).json({ skills: kq });
  }
  else return res.status(400).json('Load data failed');
}